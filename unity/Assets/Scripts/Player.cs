using UnityEngine;
using UnityEngine.UI;

public class Player : MonoBehaviour
{

    private Text _nickname;
    private Camera _camera;

    void Start()
    {
        _camera = FindObjectOfType<Camera>();
        _nickname = GetComponentInChildren<Text>();

        _nickname.text = "[DEV] sylviot";
    }

    void Update()
    {
        Vector3 position = RectTransformUtility.WorldToScreenPoint(_camera, this.transform.position);

        _nickname.transform.position = position + new Vector3(0, 25f, 0);
    }
}
