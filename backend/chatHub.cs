using LearnUniVerse.Model;
using Microsoft.AspNetCore.SignalR;

namespace LearnUniVerse
{
    public class chatHub : Hub
    {
        private readonly ChatService _chatService;
        public chatHub(ChatService chatService)
        {
            _chatService = chatService;
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "LearnUniverse");
            await Clients.Caller.SendAsync("UserConnected");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "LearnUniverse");
            var user = _chatService.GetUserByConnectionId(Context.ConnectionId);
            _chatService.RemoveUserFromList(user);

            await DisplayOnlineUser();

            await base.OnDisconnectedAsync(exception);
        }
        public async Task SendMessage(string userId, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveMessage", Context.User.Identity.Name, message);
        }

        public async Task ReceiveMessage(MessageDto message)
        {
            await Clients.Group("LearnUniverse").SendAsync("NewMessage", message);
        }

        public async Task CreatePrivateChat(MessageDto message)
        {
            string privateGroupName = GetPrivateGroupName(message.From, message.To);
            await Groups.AddToGroupAsync(Context.ConnectionId, privateGroupName);
            var toConnectionId = _chatService.GetConnectionIdByUser(message.To);
            await Groups.AddToGroupAsync(toConnectionId, privateGroupName);

            await Clients.Client(toConnectionId).SendAsync("OpenPrivateChat", message);
        }

        public async Task ReceivePrivateMessage(MessageDto message)
        {
            string privateGroupName = GetPrivateGroupName(message.From, message.To);
            await Clients.Group(privateGroupName).SendAsync("NewPrivateMessage", message);

        }

        public async Task RemovePrivateChat(string from, string to)
        {
            string privateGroupName = GetPrivateGroupName(from, to);
            await Clients.Group(privateGroupName).SendAsync("ClosePrivateChat");

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateGroupName);
            var toConnectionId = _chatService.GetConnectionIdByUser(to);
            await Groups.RemoveFromGroupAsync(toConnectionId, privateGroupName);    

        }

        private string GetPrivateGroupName(string from, string to)
        {
            var stringCompare = string.CompareOrdinal(from, to) < 0;
            return stringCompare ? $"{from}-{to}" : $"{to}-{from}";

        }

        public async Task AddUserConnectionId(string name)
        {
            _chatService.AddUserConnectionId(name, Context.ConnectionId);
            await DisplayOnlineUser();

        }

        public async Task RemoveUserConnectionId(string name)
        {
            _chatService.RemoveUserFromList(name);
        }

        private async Task DisplayOnlineUser()
        {
            var onlineUsers = _chatService.GetOnlineUsers();
            await Clients.Groups("LearnUniverse").SendAsync("OnlineUsers", onlineUsers);
        }
    }
}
