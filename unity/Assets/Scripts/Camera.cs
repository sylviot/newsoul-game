using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Camera : MonoBehaviour
{
    private GameObject _player;

	void Start ()
    {
		
	}
	
	// Update is called once per frame
	void Update ()
    {
        var players = GameObject.FindGameObjectsWithTag("Player");

        if (players.Length == 0)
            return;

        _player = players[0];

        var position = new Vector3(Mathf.Max(_player.transform.position.x, 0), Mathf.Max(_player.transform.position.y, 0), transform.position.z);
        transform.position = Vector3.Lerp(transform.position, position, 0.1f);
    }
}
