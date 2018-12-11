using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class Login : MonoBehaviour
{

    public void HandleOnEnd(Text _input)
    {
        SceneManager.LoadScene("Game");
    }
}
