using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Camera2D : MonoBehaviour
{
    private GameObject _player;

    void Update()
    {
        var players = GameObject.FindGameObjectsWithTag("Player");

        if (players.Length > 0)
            _player = players[0];

        if (_player == null)
            return;

        var position = new Vector3(Mathf.Max(_player.transform.position.x, 0), Mathf.Max(_player.transform.position.y, 0), transform.position.z);
        transform.position = Vector3.Lerp(transform.position, position, 0.1f);
    }
}
