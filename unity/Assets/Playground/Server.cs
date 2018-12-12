using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class Server : MonoBehaviour
{

    NetworkManager network;

    void Start()
    {
        network = GetComponent<NetworkManager>();
    }

    // Update is called once per frame
    void Update()
    {
        network.StartHost();
    }
}
