defmodule Game do
  @behaivor :application
  @port 4000

  def start(_type, _args) do
    args = :cowboy_router.compile(dispatch)
    
    :cowboy.start_http(
      :my_http_listener,
      100,
      [{:port, define_port()}],
      [{:env, [{:dispatch, args}] }]
    )

    Game.Server.start_link
  end

  def stop(_reason) do
    :ok
  end

  defp define_port do
    port_number = System.argv ++ [""] |> List.first

    cond do
      String.match?(port_number, ~r/^[0-9]+$/) -> String.to_integer(port_number)
      true -> @port
    end
  end

  defp dispatch do
    [{
      :_, [
        {"/ws", Game.Socket,  []},
        {:_,    Game.Web,     []}
      ]
    }]
  end
end
