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
        network.StartHost();
    }

    // Update is called once per frame
    void Update()
    {

    }
}
