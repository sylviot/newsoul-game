defmodule Game.Web do
  @path_base "web"

  def init(_, request, []) do
    {:ok, request, nil}
  end

  def handle(request, state) do
    {path, _request} = :cowboy_req.path(request)

    {:ok, content} = File.read(@path_base <> path)
    {:ok, content} = :cowboy_req.reply(200, [{"Content-Type", define_mimetype(path)}], content, request)

    {:ok, request, state}
  end

  def define_mimetype(filename) do
    case Path.extname(filename) do
      ".html" -> "text/html"
      ".js" -> "application/javascript"
      ".css" -> "text/css"
      _ -> "text/plain"
    end
  end

  def terminate(_reason, _request, _state) do
    :ok
  end

end

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
        {:_, Game.Web, []}
      ]
    }]
  end
end
