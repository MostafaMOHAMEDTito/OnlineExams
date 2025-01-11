"use client";

import { FormEvent, useState } from "react";
import Joi from "joi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordForm() {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Joi schema for validation
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
      }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate the form data
    const validationResult = schema.validate(formData, { abortEarly: false });

    if (validationResult.error) {
      // Collect validation errors
      const validationErrors: Record<string, string> = {};
      validationResult.error.details.forEach((detail) => {
        validationErrors[detail.path[0] as string] = detail.message;
      });
      setErrors(validationErrors);
      return;
    }

    setErrors({}); 
    setMessage(null); 
    setIsSubmitting(true);

    try {
      // Simulate an API call for password recovery
      const response = await fetch("https://exam.elevateegy.com/api/v1/auth/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("A recovery email has been sent. Please check your inbox.");
        setFormData({ email: "" }); // Clear the form
      } else {
        setErrors({ form: data?.message || "Something went wrong. Please try again." });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ form: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login grid grid-cols-3 gap-8  space-y-10 h-screen">
    <div className="wlcome-elevate flex h-full flex-col justify-center  bg-[#F0F4FC] col-span-1 py-8 px-8 shadow-lg rounded-tr-[100px] rounded-br-[100px]">
      <h1 className="text-5xl font-semibold leading-tight">
        Welcome to{" "}
        <span className="block text-[#122D9C] leading-loose">Elevate</span>
      </h1>
      <p className="text-lg font-normal ">
        Quidem autem voluptatibus qui quaerat aspernatur architecto natus
      </p>
      <Image width={308} height={308} src={"/bro.png"} alt="elevate" />
    </div>
    <div className="form col-span-2 px-10">
      <div className="links flex gap-6 justify-end">
        <Link
          href={"/login"}
          className="text-[#122D9C] font-medium cursor-pointer"
        >
          Sign in
        </Link>
        <Link
          href={"/register"}
          className="border px-4  font-light text-[#122D9C] rounded-xl cursor-pointer"
        >
          Sign up
        </Link>
      </div>
      <div className="flex flex-col gap-8 justify-center items-center h-full">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="w-[35%] flex flex-col gap-6"
      >
        <p className="font-semibold text-lg">Forgot your password?</p>

        <input
          type="email"
          name="email"
          className={`w-full shadow-lg border-2 p-2 rounded-lg focus-visible:outline ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          autoComplete="off"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}

        <button
          type="submit"
          className={`bg-[#4461F2] text-white font-light text-sm w-full p-3 rounded-2xl ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3653c2]"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Recovery Email"}
        </button>
      </form>
    </div>
    </div>
  </div>

  );
}
