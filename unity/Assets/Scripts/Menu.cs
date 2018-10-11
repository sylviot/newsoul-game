using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Menu : MonoBehaviour
{
    public void Update()
    {
        if (Input.anyKeyDown)
        {
            Play();
        }
    }

    private void Play()
    {
        if (true)//PlayerPrefs.GetInt(TUTORIAL_COMPLETE) == 0)
        {
            SceneManager.LoadScene("Tutorial");
        }
    }
}
