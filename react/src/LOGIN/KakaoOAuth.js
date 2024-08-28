const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API;
const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

<link rel="manifest" href="/manifest.json" />
 
const KakaoOAuth = () => {
 
  const handleKakaoLogin = () => {
    window.location.href = kakaoURL;
  }
   return(
    <>
        <div>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleKakaoLogin} className="KakaoButton">
                <circle cx="20" cy="20" r="20" fill="white"/>
                <path d="M20 8.75C27.25 8.75 33.1262 13.33 33.1262 18.9813C33.1262 24.6313 27.25 29.2113 20.0012 29.2113C19.2795 29.21 18.5585 29.1641 17.8425 29.0738L12.3325 32.6775C11.7062 33.0088 11.485 32.9725 11.7425 32.1613L12.8575 27.5638C9.25747 25.7388 6.87622 22.5763 6.87622 18.9813C6.87622 13.3313 12.7512 8.75 20.0012 8.75M27.3862 18.825L29.2237 17.045C29.3297 16.9349 29.3889 16.7879 29.3887 16.6351C29.3885 16.4822 29.329 16.3354 29.2227 16.2255C29.1164 16.1157 28.9717 16.0513 28.8189 16.0461C28.6661 16.0409 28.5173 16.0952 28.4037 16.1975L25.9937 18.53V16.6025C25.9937 16.446 25.9316 16.296 25.8209 16.1853C25.7103 16.0747 25.5602 16.0125 25.4037 16.0125C25.2472 16.0125 25.0972 16.0747 24.9865 16.1853C24.8759 16.296 24.8137 16.446 24.8137 16.6025V19.7987C24.7929 19.8901 24.7929 19.9849 24.8137 20.0763V21.875C24.8137 22.0315 24.8759 22.1815 24.9865 22.2922C25.0972 22.4028 25.2472 22.465 25.4037 22.465C25.5602 22.465 25.7103 22.4028 25.8209 22.2922C25.9316 22.1815 25.9937 22.0315 25.9937 21.875V20.1713L26.5275 19.655L28.3125 22.1962C28.357 22.2597 28.4137 22.3137 28.4791 22.3553C28.5446 22.3969 28.6176 22.4251 28.694 22.4385C28.7703 22.4518 28.8486 22.45 28.9243 22.4331C28.9999 22.4162 29.0715 22.3846 29.135 22.34C29.1984 22.2954 29.2525 22.2388 29.294 22.1734C29.3356 22.1079 29.3638 22.0349 29.3772 21.9585C29.3905 21.8821 29.3887 21.8039 29.3718 21.7282C29.3549 21.6525 29.3233 21.5809 29.2787 21.5175L27.3862 18.825ZM23.6887 21.23H21.8637V16.6213C21.8567 16.4696 21.7916 16.3265 21.6818 16.2217C21.5721 16.1169 21.4261 16.0584 21.2743 16.0584C21.1226 16.0584 20.9766 16.1169 20.8669 16.2217C20.7571 16.3265 20.692 16.4696 20.685 16.6213V21.82C20.685 22.145 20.9475 22.41 21.2737 22.41H23.6887C23.8452 22.41 23.9953 22.3478 24.1059 22.2372C24.2166 22.1265 24.2787 21.9765 24.2787 21.82C24.2787 21.6635 24.2166 21.5135 24.1059 21.4028C23.9953 21.2922 23.8452 21.23 23.6887 21.23ZM16.3675 19.8662L17.2375 17.7313L18.035 19.865L16.3675 19.8662ZM19.5212 20.475L19.5237 20.455C19.5233 20.3064 19.4666 20.1635 19.365 20.055L18.0575 16.555C18.0027 16.3882 17.8983 16.2421 17.7582 16.1362C17.6182 16.0304 17.4491 15.9698 17.2737 15.9625C17.0972 15.9624 16.9247 16.0157 16.7791 16.1155C16.6334 16.2152 16.5213 16.3566 16.4575 16.5212L14.38 21.615C14.3208 21.7599 14.3216 21.9223 14.3822 22.0666C14.4428 22.2109 14.5582 22.3252 14.7031 22.3844C14.848 22.4436 15.0104 22.4428 15.1547 22.3822C15.299 22.3216 15.4133 22.2061 15.4725 22.0613L15.8875 21.045H18.475L18.8475 22.045C18.8729 22.1197 18.913 22.1886 18.9656 22.2476C19.0181 22.3065 19.0819 22.3543 19.1532 22.3882C19.2245 22.422 19.3019 22.4412 19.3808 22.4446C19.4597 22.4479 19.5385 22.4355 19.6124 22.4078C19.6864 22.3802 19.754 22.3381 19.8114 22.2838C19.8688 22.2296 19.9147 22.1644 19.9464 22.0921C19.9781 22.0198 19.995 21.9418 19.996 21.8629C19.9971 21.784 19.9823 21.7056 19.9525 21.6325L19.5212 20.475ZM15.3675 16.6275C15.3678 16.55 15.3528 16.4733 15.3234 16.4016C15.2939 16.33 15.2506 16.2648 15.1958 16.21C15.1411 16.1552 15.0761 16.1117 15.0045 16.0821C14.9329 16.0525 14.8562 16.0373 14.7787 16.0375H10.7225C10.566 16.0375 10.4159 16.0997 10.3053 16.2103C10.1946 16.321 10.1325 16.471 10.1325 16.6275C10.1325 16.784 10.1946 16.934 10.3053 17.0447C10.4159 17.1553 10.566 17.2175 10.7225 17.2175H12.1725V21.8875C12.1725 22.044 12.2346 22.194 12.3453 22.3047C12.4559 22.4153 12.606 22.4775 12.7625 22.4775C12.9189 22.4775 13.069 22.4153 13.1797 22.3047C13.2903 22.194 13.3525 22.044 13.3525 21.8875V17.2175H14.7775C14.855 17.2178 14.9319 17.2028 15.0036 17.1733C15.0754 17.1437 15.1405 17.1003 15.1954 17.0454C15.2503 16.9906 15.2937 16.9254 15.3232 16.8537C15.3528 16.7819 15.3678 16.7051 15.3675 16.6275Z" fill="#FFD233"/>
            </svg>
        </div>
    </>
   )
};

export default KakaoOAuth;