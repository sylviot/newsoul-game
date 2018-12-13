using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy : MonoBehaviour
{
    public float _speed;
    public float _distance;
    public Transform _groundDetection;

    private bool _movingRight = true;

    void Update()
    {
        transform.Translate(Vector2.right * _speed * Time.deltaTime);

        RaycastHit2D groundInfo = Physics2D.Raycast(_groundDetection.position, Vector2.down, 2f);

        if(!groundInfo.collider)
        {
            if(_movingRight)
            {
                transform.eulerAngles = new Vector3(0, -180, 0);
            }
            else
            {
                transform.eulerAngles = new Vector3(0, 0, 0);
            }

            _movingRight = !_movingRight;
        }
    }
}
