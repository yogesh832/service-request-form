import { useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import api from "../../utils/api";
import { toast } from "react-toastify";
import PhoneInput from "../../components/ui/PhoneInput";

const EmployeeSignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "employee",
    company: "", // Will be set via Salkatech _id
  });

  const [phoneError, setPhoneError] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const res = await api.get("/companies");
        const companies = res.data.data.companies;
        const salkatech = companies.find(
          (company) => company.name.toLowerCase() === "salkatech"
        );
        if (salkatech) {
          setFormData((prev) => ({ ...prev, company: salkatech._id }));
        } else {
          toast.error("Salkatech company not found");
        }
      } catch (err) {
        console.error("Failed to fetch companies", err);
        toast.error("Failed to fetch companies");
      }
    };

    fetchCompanyId();
  }, []);

  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    if (phoneTouched) setPhoneError(!validatePhone(value));
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    setPhoneError(!validatePhone(formData.phone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const isValidPhone = validatePhone(formData.phone);
    setPhoneTouched(true);
    setPhoneError(!isValidPhone);
    if (!isValidPhone) return toast.error("Please enter a valid phone number");

    setIsLoading(true);
    try {
      const dataToSend = {
        ...formData,
        phone: `+91${formData.phone}`,
      };
      await api.post("/auth/register", dataToSend);
      toast.success("Account created successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4 py-8">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-xl bg-white border border-gray-100">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join us today!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200"
                placeholder="Full Name"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200"
                placeholder="Email Address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                error={phoneError}
                onBlur={handlePhoneBlur}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full py-3 px-4 rounded-xl bg-gray-50 border border-gray-200"
                placeholder="Password"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value="Employee"
                disabled
                className="w-full py-3 px-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value="Salkatech"
                disabled
                className="w-full py-3 px-4 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex justify-center items-center ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EmployeeSignupForm;
