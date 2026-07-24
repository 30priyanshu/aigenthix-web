import React from "react";

// Data for the 6 core services
const coreServices = [
  {
    title: "AI Strategy Consulting",
    description:
      "We undertake a comprehensive assessment of your current capabilities, market trends, and the competitive landscape to formulate AI strategies tailored to your unique needs. Whether you are a startup seeking to harness AI’s potential or an enterprise aiming to enhance your AI capabilities, our consulting services empower you to unlock the full potential of AI and stay ahead in today's dynamic business landscape.",
    icon: (
      <svg
        className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9.663 17h4.673M12 3v13m-4-8h8m-4 8l-1.677 3.353C8.847 21.65 9.877 23 12 23c2.123 0 3.153-1.35 3.677-2.647L14 16m-2-12a8 8 0 100 16 8 8 0 000-16z"
        />
      </svg>
    ),
  },
  {
    title: "AI Development and Integration",
    description:
      "From natural language processing and computer vision applications to predictive analytics and recommendation systems, we specialize in developing AI solutions that deliver tangible value across industries. By seamlessly integrating these solutions into your workflows, we ensure a smooth transition that enhances operational efficiency, enables better decision-making, and propels business growth.",
    icon: (
      <svg
        className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M10 20l4-16m4 4l4 4m-4 4l4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Data Engineering",
    description:
      "Our data engineering services encompass the entire data lifecycle, from sourcing and cleansing to structuring and enrichment. With a focus on data mining, analysis, annotation, and labeling, we lay the foundation for robust AI models. Leveraging advanced techniques and tools, we ensure that your data is optimized for machine learning, enabling accurate and reliable model training.",
    icon: (
      <svg
        className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4 7V4m0 0h4M4 4l4 4m8 0V4m0 0h-4m4 0l-4 4m0 4v4m0 0v4m0-4h4m-4 0h-4m-4-4V7m0 0V4m0 0h4m-4 0l4 4m-4 0v4m0 0v4m0-4h4m-4 0h-4"
        />
      </svg>
    ),
  },
  {
    title: "Software Design and Development",
    description:
      "With a focus on functionality, scalability, and user experience, our team collaborates with you to deliver high-quality, custom software. Whether you want enterprise software for workflow automation and process optimization, web applications for e-commerce, content management and customer support, or mobile applications for iOS and Android platforms, we have got you covered.",
    icon: (
      <svg
        className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M10 20l4-16m-4 16l-4-4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Machine Learning Model Development",
    description:
      "With our deep expertise in machine learning, deep learning, and data engineering, we craft robust ML models tailored to diverse use cases, spanning industries such as finance, healthcare and e-commerce. Whether creating models from scratch or fine-tuning existing ones, our team will collaborate closely with you to understand your unique challenges and objectives, ensuring the delivery of exceptional results.",
    icon: (
      <svg
        className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "AI Agents Development",
    description:
      "Leveraging advanced AI agent development tools like crewAI and AutoGen Studio, we build intelligent AI agents capable of executing a multitude of tasks, including analysis, research, code generation, and audits, and reviews. Whether you want a single-agent system or a multi-agent system, our custom AI agent systems built using top-tier models and extensive skill libraries will optimize productivity across your organization.",
    icon: (
      <svg
        className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 9v6m-3-3h6"
        />
      </svg>
    ),
  },
];

const timelineData = [
  {
    yearRange: "2008 - 2018",
    solutions: "45+ Digital Solutions",
    clients: ["P&G", "3M", "U.S. ARMY", "ESPN"],
  },
  {
    yearRange: "2019",
    solutions: "80+ Digital Solutions",
    clients: ["SIEMENS", "Budweiser", "ETOS"],
  },
  {
    yearRange: "2020",
    solutions: "90+ Digital Solutions",
    clients: ["TRACE RX", "PEARSON"],
  },
  {
    yearRange: "2021",
    solutions: "100+ Digital Solutions",
    clients: ["Sultanate of Oman", "KINESIS"],
  },
  {
    yearRange: "2022",
    solutions: "125+ Digital Solutions",
    clients: ["SIGHT SCIENCES", "SAFE-GUARD"],
  },
  {
    yearRange: "2023",
    solutions: "150+ Digital Solutions",
    clients: ["rockspace", "ProtocolLabs"],
  },
  {
    yearRange: "2024",
    solutions: "160+ Digital Solutions",
    clients: ["Scrut", "Regal Rexnord", "NSG"],
  },
];

const Innovative = () => {
  return (
    <div className="bg-white font-sans">
      {/* Header Section */}
      <section className="bg-[#0B2847] py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6 tracking-tight">
            Building Innovative and Creative AI Solutions
          </h2>
          <p className="text-lg text-gray-200 leading-relaxed">
            With over 15 years of tech expertise, we take the initiative to help startups and Fortune 500 companies innovate and thrive in the AI landscape. From custom solutions to seamless workflow integration, we deliver proven results that drive real growth.
          </p>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {coreServices.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl border border-gray-100 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col items-start text-left"
            >
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-100 rounded-tl-full transform translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
              <div className="mb-6 p-3 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300 relative z-10">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-800 mb-4 relative z-10">
                {service.title}
              </h3>
              <p className="text-base text-gray-700 leading-relaxed flex-grow relative z-10">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>
{/* Timeline Section - Clean Fixed Design */}
{/* <section className="py-24 px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-2 text-center tracking-tight">
      Big Brands Trust Us
    </h2>
    <p className="text-lg text-gray-600 mb-16 text-center">
      Our journey of innovation, marked by key milestones and partnerships.
    </p>

    <div className="relative overflow-x-auto pb-6 scrollbar-hide">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style> */}

      {/* <div className="flex w-full min-w-max py-8"> */}
        {/* Timeline Line */}
        {/* <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-gray-300 via-blue-500 to-gray-300 mx-10 transform -translate-y-1/2"></div>

        {timelineData.map((data, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-64 text-center px-6 group transition duration-500 hover:scale-105"
            style={{ marginLeft: index === 0 ? "0" : "4rem" }}
          > */}
            {/* Timeline Dot */}
            {/* <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow-lg group-hover:bg-blue-400 transition duration-300"></div>
            </div> */}

            {/* Timeline Card */}
            {/* <div className="mt-16 p-6 bg-white rounded-xl shadow-xl border border-gray-200 transition duration-300 group-hover:shadow-blue-200/50 relative"> */}
              {/* Moved label INSIDE the card */}
              {/* <div className="mb-4"> */}
                {/* Show the solutions label without the leading numeric token (e.g. remove "45+") */}
                {/* <p className="text-2xl font-bold text-blue-700 leading-tight">
                  {(() => {
                    const parts = data.solutions.split(" ");
                    return parts.length > 1 ? parts.slice(1).join(" ") : data.solutions;
                  })()}
                </p>
              </div> */}

              {/* Client names */}
              {/* <div className="space-y-2 text-sm text-gray-700 h-32 overflow-hidden">
                {data.clients.map((client, i) => (
                  <p
                    key={i}
                    className="font-semibold hover:text-blue-700 transition duration-200"
                  >
                    {client}
                  </p>
                ))}
              </div>
            </div> */}

            {/* Year removed per design request; space preserved by card margins */}
          {/* </div>
        ))}
      </div>
    </div>
  </div>
</section> */}

    </div>
  );
};

export default Innovative;
