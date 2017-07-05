defmodule Game.Server do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ok, [name: :game_server])
  end

  def init(:ok), do:  {:ok, HashSet.new}

  def handle_call({:join, nickname}, {_from, _reference}, state) do
    state = HashSet.put(state, {_from, nickname})

    {:reply, {:ok, state}, state}
  end

  def handle_call({:talk, data}, {_from, _reference}, state) do
    Enum.each(state, fn({pid, pid_nickname}) ->
      send pid, {:broadcast, data}
    end)

    {:reply, :ok, state}
  end

  def handle_call({:leave, nickname}, {_from, _reference}, state) do
    state = HashSet.delete(state, {_from, nickname})

    {:reply, {:ok, state}, state}
  end

end
