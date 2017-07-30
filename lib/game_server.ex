defmodule Game.Server do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ok, [name: :game_server])
  end

  def init(:ok), do:  {:ok, HashSet.new}

  def handle_call({:login_account, login, senha}, {_from, _reference}, state) do
    IO.inspect _from
    send _from, {:broadcast, [action: "login_account_success"]}

    {:reply, :ok, state}
  end

  def handle_call({:load_character, character_id}, {_from, _reference}, state) do
    state = HashSet.put(state, {_from, character_id})
    IO.inspect state

    character_data = [nickname: character_id, hp: 100, mana: 100, x: 100, y: 35]

    Enum.each(state, fn({pid, pid_nickname}) ->
      cond do
        pid == _from -> send _from, {:broadcast, [action: "load_character"] ++ character_data}
        true         -> send pid, {:broadcast, [action: "join"] ++ character_data}
      end
    end)

    {:reply, {:ok, state}, state}
  end

  def handle_call({:movement, nickname, x, y}, {_from, _reference}, state) do
    players = HashSet.delete(state, {_from, nickname})

    Enum.each(players, fn({pid, pid_nickname}) ->
      send pid, {:broadcast, [action: "movement", nickname: nickname, x: x, y: y]}
    end)

    {:reply, :ok, state}
  end

  def handle_call({:bug, nickname, text, screen}, {_from, _reference}, state) do
    "data:image/png;base64," <> raw = screen

    {:ok, data} = Base.decode64(raw)

    dt = DateTime.utc_now
    filename = "#{dt.year}#{dt.month}#{dt.day}#{dt.hour}#{dt.minute}#{dt.second}"

    File.write("./web/bug/index.html", "<a href='/bug/#{filename}.png' target='_blank'>Screen</a> [#{DateTime.to_string(dt)}] #{text} <br>" , [:append])
    File.write("./web/bug/#{filename}.png", data)

    {:reply, :ok, state}
  end

  def handle_call({:chat, nickname, data}, {_from, _reference}, state) do
    players = HashSet.delete(state, {_from, nickname})

    Enum.each(players, fn({pid, pid_nickname}) ->
      send pid, {:broadcast, data}
    end)

    {:reply, :ok, state}
  end

  def handle_call({:leave, nickname}, {_from, _reference}, state) do
    state = HashSet.delete(state, {_from, nickname})

    {:reply, {:ok, state}, state}
  end

end
