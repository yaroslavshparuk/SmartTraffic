using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;

namespace SmartTraffic.Domain.Services
{
    public class MQTTService
    {
        public async Task Send(string payload, string topic)
        {
            var mqttClient = new MqttFactory().CreateMqttClient();

            await mqttClient.ConnectAsync(new MqttClientOptionsBuilder()
                                          .WithTcpServer("localhost", 1883)
                                          .Build());
            if (mqttClient.IsConnected)
            {
                await mqttClient.PublishAsync(new MqttApplicationMessageBuilder()
                                              .WithTopic(topic)
                                              .WithPayload(payload)
                                              .WithQualityOfServiceLevel(0)
                                              .Build());
            }

            await mqttClient.DisconnectAsync();
        }
    }
}
