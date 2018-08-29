using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {

	private Rigidbody2D rb;
	public float jumpForce;
	public float speed;
	private float moveInput;

	private bool isGrounded;
	public Transform feetPos;
	public float checkRadius;
	public LayerMask whatIsGround;

	void Start () {
			rb = GetComponent<Rigidbody2D>();
	}
	
	// Update is called once per frame
	void Update () {
		moveInput = Input.GetAxisRaw("Horizontal");
		rb.velocity = new Vector2(moveInput * speed, rb.velocity.y);
		
		isGrounded = Physics2D.OverlapCircle(feetPos.position, checkRadius, whatIsGround);

		if ( isGrounded && Input.GetKeyDown(KeyCode.Space)) {
			rb.velocity = Vector2.up * jumpForce;
		}
	}
}
