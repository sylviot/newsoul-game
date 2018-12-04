using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class CommandNetwork : NetworkBehaviour
{
    [SerializeField]
    private GameObject _prefab;

	void Update ()
    {
        if(isLocalPlayer)
        {
            if(Input.GetKeyDown(KeyCode.F))
            {
                CmdExample(5.0f);
            }
        }
	}




    [Command(channel =1)]
    private void CmdExample(float lifetime)
    {
        var prefab = (GameObject)Instantiate(
            _prefab,
            transform.position + transform.right,
            Quaternion.identity);

        Destroy(prefab, lifetime);

        NetworkServer.Spawn(prefab);
    }
}
