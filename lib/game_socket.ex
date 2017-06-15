defmodule Game.Socket do
  @behaivor :cowboy_websocket
  @timeout 60000

  def init(_, request, options) do
    {:upgrade, :protocol, :cowboy_websocket}
  end

  def websocket_init(_type, request, _options) do
    IO.puts "Connected!"
    {:ok, request, [], @timeout}
  end

  def websocket_terminate(_reason, _request, _state) do
    IO.puts "Disconnected!"
    :ok
  end

  def websocket_handle({:text, data}, request, state) do
    case JSON.decode(data) do
      {:ok, result} -> handle(result["action"], result, request, state)
      _ -> {:ok, request, state}
    end
  end

  def websocket_info({:broadcast, data}, request, state) do
    IO.puts "Broadcast"
    case JSON.encode(data) do
      {:ok, result} -> {:reply, {:text, result}, request, state}
    end
  end

  defp handle("join", data, request, state) do
    state = List.keystore(state, :nickname, 0, {:nickname, data["nickname"]})

    join_info = [action: "join", nickname: data["nickname"], content: " entrou no jogo."]

    :gen_server.call(:game_server, {:join, data["nickname"]})
    :gen_server.call(:game_server, {:talk, join_info})

    {:ok, request, state}
  end

  defp handle("talk", data, request, state) do
    IO.puts "handle talk"
    {:nickname, nickname} = List.keyfind(state, :nickname, 0)

    talk_info = [action: "talk", nickname: nickname, content: data["message"]]

    :gen_server.call(:game_server, {:talk, talk_info})

    {:ok, request, state}
  end

  defp handle(_, data, request, state), do: {:ok, request, state}

end
