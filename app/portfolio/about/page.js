import About from "./About";
import { PortfolioApiService } from "@/services/PortfolioApiService";


export default async function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL;

  let skillsData = null;
  let educationData = null;
  let certificateData = null;
  let error = null;

  try {
    const [skillsRes, educationRes, certificateRes] = await Promise.all([
      PortfolioApiService.fetchSkill(),
      PortfolioApiService.fetchEducation(),
      PortfolioApiService.fetchCertificates(),
    ]);

    [skillsData, educationData, certificateData] = [skillsRes, educationRes, certificateRes];
  } catch (err) {
    console.error("❌ Error fetching About page data:", err);
    error = err;
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        ⚠️ Failed to load About data. Please try again later.
      </div>
    );
  }

  return (
    <About
      skillsData={skillsData}
      educationData={educationData}
      certificateData={certificateData}
    />
  );
}
