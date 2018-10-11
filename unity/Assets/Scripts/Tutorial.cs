using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Tutorial : MonoBehaviour
{
    public GameObject player;
    public GameObject menuChooseNameUI;

    private void OnTriggerEnter2D(Collider2D other)
    {
        Debug.Log("Collider");
        ChooseName();
    }

    private void ChooseName()
    {
        Time.timeScale = 0f;
        menuChooseNameUI.SetActive(true);
    }

    public void OnChooseName()
    {
        PlayerPrefs.SetString("NAME", "No Name");
        SceneManager.LoadScene("Game");
        
        //player.transform.position += new Vector3(2f, 0, 0);
        //menuChooseNameUI.SetActive(false);
        //Time.timeScale = 1f;
    }
}
