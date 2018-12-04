using UnityEngine;
using UnityEngine.Networking;

public class CharacterNetwork : NetworkBehaviour
{
    /* Fields */
    [SerializeField]
    private float _speed = 5f;

    [SerializeField]
    private float _jumpForce = 400f;

    [SerializeField]
    private LayerMask _groundLayer;

    [SerializeField]
    private Transform _groundCheck;

    [SerializeField]
    private Transform _ceilingCheck;

    [SerializeField]
    private Camera _camera;

    /* Attributes */
    const float _groundedRadius = .2f;
    private Rigidbody2D _rigidbody2D;

    private void Awake()
    {
        _rigidbody2D = GetComponent<Rigidbody2D>();
        _camera = GetComponent<Camera>();
    }

    void Update()
    {
        if (isLocalPlayer)
        {
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");

            Vector3 movement = new Vector3(horizontal, 0, vertical);
            transform.position += movement * Time.deltaTime * _speed;


            bool isGrounded = Physics2D.OverlapCircle(_groundCheck.position, _groundedRadius, _groundLayer) == null;

            if (isGrounded && Input.GetKeyDown(KeyCode.Space))
            {
                _rigidbody2D.velocity = Vector2.up * _jumpForce;
            }
        }
    }
}