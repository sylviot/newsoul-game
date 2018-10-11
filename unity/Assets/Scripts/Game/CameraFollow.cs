using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    public Transform player;
    public Vector3 offset;
    public float lerp;
    
    void Update()
    {
        var position = new Vector3(Mathf.Max(player.position.x, 0), Mathf.Max(player.position.y, 0), 0);
        transform.position = Vector3.Lerp(transform.position, position + offset, lerp);
    }
}
