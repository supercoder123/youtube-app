import { NextPage } from "next";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, provider, clientDb } from "../firebase/client";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

type LoginPageProps = {};

async function signIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    const user = result.user;
    if (!user) {
      console.log("No user found");
      return;
    }
    const docRef = doc(clientDb, "users", user.email!);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      toast.success("Logged In", { position: "top-center" });
      return true;
    } else {
      // doc.data() will be undefined in this case
      toast.error("Unauthorized", { position: "top-center" });
      return false;
    }
  } catch (error: any) {
    console.error(error);
    return false;
  }
}

const Login: NextPage<LoginPageProps> = ({}) => {
  const router = useRouter();

  return (
    <div>
      <button
        className="flex p-2 shadow-md m-3 bg-gray-100 hover:bg-gray-300 rounded-md text-black items-center font-bold"
        onClick={async () => {
          const loggedIn = await signIn();
          if (loggedIn) {
            router.push("/");
          }
        }}
      >
        <div className="bg-google-logo h-5 w-5 pt-2 bg-no-repeat bg-cover mr-3"></div>
        <div> Sign in with Google</div>
      </button>
    </div>
  );
};

export default Login;
