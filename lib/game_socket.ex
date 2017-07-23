defmodule Game.Socket do
  @behaivor :cowboy_websocket
  @timeout 600000

  def init(_, request, options) do
    {:upgrade, :protocol, :cowboy_websocket}
  end

  def websocket_init(_type, request, _options) do
    IO.puts "Connected!"
    {:ok, request, [], @timeout}
  end

  def websocket_terminate(_reason, _request, state) do
    IO.puts "Disconnected!"
    {:nickname, nickname} = List.keyfind(state, :nickname, 0) 

    leave_info = [action: "leave", nickname: nickname]

    :gen_server.call(:game_server, {:leave, :nickname})
    :gen_server.call(:game_server, {:chat, nickname, leave_info})

    :ok
  end

  def websocket_handle({:text, data}, request, state) do
    case JSON.decode(data) do
      {:ok, result} -> handle(result["action"], result, request, state)
      _ -> {:ok, request, state}
    end
  end

  def websocket_info({:broadcast, data}, request, state) do
    case JSON.encode(data) do
      {:ok, result} -> {:reply, {:text, result}, request, state}
    end
  end

  defp handle("login_account", data, request, state) do
    IO.puts "> Try login account"

    :gen_server.call(:game_server, {:login_account, data["login"], data["senha"]});

    {:ok, request, state}
  end

  defp handle("load_character", data, request, state) do
    IO.puts "> Load character info"
    state = List.keystore(state, :nickname, 0, {:nickname, data["character_id"]})

    :gen_server.call(:game_server, {:load_character, data["character_id"]})

    {:ok, request, state}
  end

  defp handle("movement", data, request, state) do
    {:nickname, nickname} = List.keyfind(state, :nickname, 0) 

    :gen_server.call(:game_server, {:movement, nickname, data["x"], data["y"]})

    {:ok, request, state}
  end

  defp handle("join", data, request, state) do
    IO.puts "Connected " <> data["nickname"]
    state = List.keystore(state, :nickname, 0, {:nickname, data["nickname"]})

    join_info = [action: "join", nickname: data["nickname"], content: " entrou no jogo."]

    :gen_server.call(:game_server, {:join, data["nickname"]})
    :gen_server.call(:game_server, {:chat, join_info})

    {:ok, request, state}
  end

  defp handle("chat", data, request, state) do
    {:nickname, nickname} = List.keyfind(state, :nickname, 0)

    chat_data = [action: "chat", nickname: nickname, message: data["message"]]

    :gen_server.call(:game_server, {:chat, nickname, chat_data})

    {:ok, request, state}
  end

  defp handle(_, data, request, state), do: {:ok, request, state}

end
