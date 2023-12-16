import { useSelector } from "react-redux";
import loginImg from "../assets/Images/login.webp";
import Spinner from "../components/common/Spinner";
import Template from "../components/core/Auth/Template";

function Login() {
  const { loading } = useSelector((state) => state.auth);
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] w-[100vw] ">
          <Spinner></Spinner>
        </div>
      ) : (
        <Template
          title="Welcome Back"
          description1="Build skills for today, tomorrow, and beyond."
          description2="Education to future-proof your career."
          image={loginImg}
          formType="login"
        />
      )}
    </div>
  );
}

export default Login;
