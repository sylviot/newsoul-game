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
