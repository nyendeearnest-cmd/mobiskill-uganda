"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  educationLevel: string;
  bio: string;
  careerGoal: string;
  availableTime: string;
  internetAccess: string;
  deviceType: string;
};

const emptyProfile: ProfileData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  educationLevel: "",
  bio: "",
  careerGoal: "",
  availableTime: "",
  internetAccess: "",
  deviceType: "",
};

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setFormData(data.profile);
      } catch (error) {
        console.error("Profile loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleChange(field: keyof ProfileData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          location: formData.location,
          educationLevel: formData.educationLevel,
          bio: formData.bio,
          careerGoal: formData.careerGoal,
          availableTime: formData.availableTime,
          internetAccess: formData.internetAccess,
          deviceType: formData.deviceType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile.");
      }

      setFormData(data.profile);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-500">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              MobiSkill Uganda
            </h1>

            <p className="text-sm text-slate-500">
              Learn. Practice. Earn.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <section className="mb-6">
          <p className="text-sm font-semibold text-blue-600">
            LEARNER PROFILE
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Complete your profile
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tell MobiSkill about your background, goals, available time,
            internet access, and device. This information will help us
            personalize your learning journey.
          </p>
        </section>

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Basic Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your account information and contact details.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={formData.name}
                  disabled
                  className="w-full rounded-lg border bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-lg border bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                  placeholder="+256..."
                  className="w-full rounded-lg border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>

                <input
                  type="text"
                  value={formData.location}
                  onChange={(event) =>
                    handleChange("location", event.target.value)
                  }
                  placeholder="e.g. Kampala"
                  className="w-full rounded-lg border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Education & Career
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Help us understand where you are and where you want to go.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Education Level
                </label>

                <select
                  value={formData.educationLevel}
                  onChange={(event) =>
                    handleChange(
                      "educationLevel",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select education level</option>
                  <option value="PRIMARY">Primary</option>
                  <option value="SECONDARY">Secondary</option>
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="DEGREE">Bachelor&apos;s Degree</option>
                  <option value="POSTGRADUATE">Postgraduate</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Career Goal
                </label>

                <input
                  type="text"
                  value={formData.careerGoal}
                  onChange={(event) =>
                    handleChange(
                      "careerGoal",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Become a web developer"
                  className="w-full rounded-lg border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  About You
                </label>

                <textarea
                  value={formData.bio}
                  onChange={(event) =>
                    handleChange("bio", event.target.value)
                  }
                  rows={5}
                  placeholder="Tell us briefly about yourself, your interests, or experience..."
                  className="w-full resize-none rounded-lg border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Learning Environment
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This helps MobiSkill recommend learning that fits your
              situation.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Available Time
                </label>

                <select
                  value={formData.availableTime}
                  onChange={(event) =>
                    handleChange(
                      "availableTime",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select time</option>
                  <option value="LESS_THAN_1_HOUR">
                    Less than 1 hour/day
                  </option>
                  <option value="1_TO_2_HOURS">
                    1–2 hours/day
                  </option>
                  <option value="2_TO_4_HOURS">
                    2–4 hours/day
                  </option>
                  <option value="MORE_THAN_4_HOURS">
                    More than 4 hours/day
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Internet Access
                </label>

                <select
                  value={formData.internetAccess}
                  onChange={(event) =>
                    handleChange(
                      "internetAccess",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select access</option>
                  <option value="ALWAYS">Always available</option>
                  <option value="OFTEN">Often available</option>
                  <option value="LIMITED">Limited</option>
                  <option value="RARE">Rare</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Main Device
                </label>

                <select
                  value={formData.deviceType}
                  onChange={(event) =>
                    handleChange(
                      "deviceType",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select device</option>
                  <option value="SMARTPHONE">Smartphone</option>
                  <option value="TABLET">Tablet</option>
                  <option value="LAPTOP">Laptop</option>
                  <option value="DESKTOP">Desktop</option>
                  <option value="MULTIPLE">
                    Multiple devices
                  </option>
                </select>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}