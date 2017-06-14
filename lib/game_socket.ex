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
    :ok
  end

  def websocket_handle({:text, data}, request, state) do
    IO.puts "Data receive!"
    {:ok, request, state} 
  end

  def websocket_info({:broadcast, data}, request, state) do
    {:ok, request, state}
  end

end
