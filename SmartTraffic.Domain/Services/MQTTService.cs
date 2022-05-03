using RabbitMQ.Client;
using System.Text;

namespace SmartTraffic.Domain.Services
{
    public class MQTTService
    {
        public void Send(string message, string queue)
        {
            using (var connection = new ConnectionFactory() { HostName = "localhost" }.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: queue,
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                channel.BasicPublish(exchange: "",
                                     routingKey: queue,
                                     basicProperties: null,
                                     body: Encoding.UTF8.GetBytes(message));
            }
        }
    }
}
