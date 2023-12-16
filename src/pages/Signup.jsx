import { useSelector } from "react-redux";
import signupImg from "../assets/Images/signup.webp";
import Template from "../components/core/Auth/Template";
import Spinner from "../components/common/Spinner";

function Signup() {
  const { loading } = useSelector((state) => state.auth);
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[100vh] w-[100vw] ">
          <Spinner></Spinner>
        </div>
      ) : (
        <Template
          title="Join the millions learning to code with StudyNotion for free"
          description1="Build skills for today, tomorrow, and beyond."
          description2="Education to future-proof your career."
          image={signupImg}
          formType="signup"
        />
      )}
    </div>
  );
}

export default Signup;
