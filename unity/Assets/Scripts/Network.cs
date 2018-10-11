using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Net.Sockets;
using System.Threading;

public class Network : MonoBehaviour
{
    public GameObject player;
    public GameObject playerFab;
    private TcpClient socket = new TcpClient();
    private NetworkStream network = default(NetworkStream);
    private const string HOST = "127.0.0.1";
    private const int PORT = 5000;

    private Dictionary<string, GameObject> players;

    void Start()
    {
        Debug.Log("Network start");
        socket.Connect(HOST, PORT);
        network = socket.GetStream();
        this.Send("From unity");

        Thread thread = new Thread(this.Receive);
        thread.Start();

    }

    private void Receive()
    {
        while(true)
        {
            /*serverStream = clientSocket.GetStream();
                int buffSize = 0;
                byte[] inStream = new byte[10025];
                buffSize = clientSocket.ReceiveBufferSize;
                serverStream.Read(inStream, 0, buffSize);
                string returndata = System.Text.Encoding.ASCII.GetString(inStream);
                readData = "" + returndata;
                msg();
            */
            network = socket.GetStream();
            int bufferSize = socket.ReceiveBufferSize;
            byte[] inputStream = new byte[bufferSize + 1];
            network.Read(inputStream, 0, bufferSize);
            string data = System.Text.Encoding.ASCII.GetString(inputStream);

            UpdatePlayer(data);

            //Debug.Log(data);

        }
    }

    private void UpdatePlayer(string data)
    {
        string[] position = data.Split(' ');
        if(!players.ContainsKey(position[0]))
        {
            players.Add(position[0], Instantiate(playerFab, transform) as GameObject);
            //players[position[0]].transform.position.x = float.Parse(position[1]);
            //players[position[0]].transform.position.x = float.Parse(position[2]);
        }
    }

    private void Send(string data)
    {
        byte[] outStream = System.Text.Encoding.ASCII.GetBytes(data);
        network.Write(outStream, 0, outStream.Length);
        network.Flush();
    }

    // Update is called once per frame
    void Update()
    {
        this.Send(string.Format("{0} {1}", player.transform.position.x, player.transform.position.y));
    }
}
