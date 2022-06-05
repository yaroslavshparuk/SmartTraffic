using Coravel.Invocable;
using SmartTraffic.DAL.Contexts;
using SmartTraffic.Domain.Services;
using FuzzyLogicController;
using FuzzyLogicController.FLC;
using FuzzyLogicController.MFs;
using FuzzyLogicController.RuleEngine;

namespace SmartTraffic.Domain.Jobs
{
    public class CountGreenTimeJob : IInvocable
    {
        private readonly MQTTService _mqqtService;
        private readonly TrafficDataService _trafficDataService;
        private readonly Config _configurator;
        private readonly FLC _flc;
        private readonly LingVariable _street1 = new LingVariable("Street 1", VarType.Input);
        private readonly LingVariable _street2 = new LingVariable("Street 2", VarType.Input);
        private readonly LingVariable _time1 = new LingVariable("Time 1", VarType.Output);
        private readonly List<Rule> _rules;

        public CountGreenTimeJob(MQTTService mqqtService, TrafficDataService trafficDataService)
        {
            _mqqtService = mqqtService;
            _trafficDataService = trafficDataService;
            _configurator = new Config(ImpMethod.Prod, ConnMethod.Min);
            _flc = new FLC(_configurator);
            _street1.setRange(0, 100);
            _street1.addMF(new Gaussmf("Low", -6, 16));
            _street1.addMF(new Gaussmf("Average", 10, 50));
            _street1.addMF(new Gaussmf("High", 13, 105));
            _street2.setRange(0, 100);
            _street2.addMF(new Gaussmf("Low", -6, 16));
            _street2.addMF(new Gaussmf("Average", 10, 50));
            _street2.addMF(new Gaussmf("High", 13, 105));
            _time1.setRange(-1, 1);
            _time1.addMF(new Gaussmf("Lower", 0.425, -1));
            _time1.addMF(new Gaussmf("None", 0.15, 0));
            _time1.addMF(new Gaussmf("Increase", 0.425, 1));
            _rules = new List<Rule>
                    {
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "Low"), new RuleItem(_street2.Name, "Low") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "None") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "Average"), new RuleItem(_street2.Name, "Low") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "Increase") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "High"), new RuleItem(_street2.Name, "Low") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "Increase") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "Low"), new RuleItem(_street2.Name, "Average") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "Lower") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "Average"), new RuleItem(_street2.Name, "Average") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "None") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "High"), new RuleItem(_street2.Name, "Average") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "Increase") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "Low"), new RuleItem(_street2.Name, "High") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "Lower") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "Average"), new RuleItem(_street2.Name, "High") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "Lower") },
                            Connector.And),
                        new Rule(
                            new List<RuleItem> { new RuleItem(_street1.Name, "High"), new RuleItem(_street2.Name, "High") },
                            new List<RuleItem> { new RuleItem(_time1.Name, "None") },
                            Connector.And),
                    };
        }

        public async Task Invoke()
        {
            using (var ctx = new GeneralContext())
            {
                foreach (var crossroad in ctx.Crossroads)
                {
                    var input_sets = new List<FuzzySet>
                    {
                        new FuzzySet(_flc.Fuzzification(_trafficDataService.GetCarsAmount(crossroad.FirstStreetId), _street1), _street1.Name),
                        new FuzzySet(_flc.Fuzzification(_trafficDataService.GetCarsAmount(crossroad.SecondStreetId), _street2), _street2.Name)
                    };

                    var rulesOut = new InferEngine(_configurator, _rules, input_sets).evaluateRules()?.FirstOrDefault()?.Set;
                    var controlValue = rulesOut?.FirstOrDefault(x => x.FuzzyValue == rulesOut?.Max(x => x.FuzzyValue))?.MemberShipName;
                    await _mqqtService.Send(controlValue, "crossroad_" + crossroad.Id);
                }
            }
        }
    }
}
