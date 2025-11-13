import About from "./About";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export const revalidate = 0;

export default async function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL;
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    console.log("⏩ Skipping About data fetch during Docker build");
    return (
      <div className="p-10 text-center text-gray-500">
        ⏳ About data skipped during build. It will load dynamically once the app runs.
      </div>
    );
  }

  try {
    const [skillsRes, educationRes, certificateRes] = await Promise.all([
      PortfolioApiService.fetchSkill(),
      PortfolioApiService.fetchEducation(),
      PortfolioApiService.fetchCertificates(),
    ]);

    const [skillsData, educationData, certificateData] = await Promise.all([
      skillsRes,
      educationRes,
      certificateRes,
    ]);

    return (
      <About
        skillsData={skillsData}
        educationData={educationData}
        certificateData={certificateData}
      />
    );
  } catch (err) {
    console.error("❌ Error fetching About page data:", err);
    return (
      <div className="p-10 text-center text-red-500">
        ⚠️ Failed to load About data. Please try again later.
      </div>
    );
  }
}
