using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Menu : MonoBehaviour {

	public void MenuOnClick() {
		Debug.Log("Click");
	}

	public void Update() {
		if(Input.GetKeyDown("space")) {
			SceneManager.LoadScene("Game");
		}
	}
}
