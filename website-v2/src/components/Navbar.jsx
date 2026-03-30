import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "./IMAGES/aigenthix.webp";
import { useAuth } from "../context/AuthContext";

const productsDropdownItems = [
  { title: "Sahayak AI", to: "/products/sahayak-ai" },
  { title: "Video Translation", to: "/products/video-translation" },
  { title: "AI Interviewer", to: "/products/ai-interviewer" },
  { title: "Project Management", to: "/products/project-management" },
];

const serviceDropdownItems = [
  { title: "Generative AI", to: "/services/generative-ai" },
  { title: "Artificial Intelligence & ML", to: "/services/ai-ml" },
  { title: "Robotics", to: "/services/robotics" },
  { title: "Humanoids", to: "/services/humanoids" },
  { title: "Cybersecurity", to: "/services/cybersecurity" },
  { title: "Data Engineering", to: "/services/data-engineering" },
  { title: "Web3", to: "/services/web3" },
  { title: "Software Development", to: "/services/software-development" },
  { title: "IoT & Embedded Systems", to: "/services/iot" },
  { title: "API Integration Services", to: "/services/api-integration" },
  { title: "Blockchain Technology", to: "/services/blockchain" },
];

const industriesDropdownItems = [
  { title: "Enterprise Solutions", to: "/industries/enterprise-solutions" },
  { title: "Finance", to: "/industries/finance" },
  { title: "Healthcare", to: "/industries/healthcare" },
  { title: "Education Technology", to: "/industries/education" },
  { title: "Retail & E-commerce", to: "/industries/retail-ecommerce" },
  { title: "Manufacturing", to: "/industries/manufacturing" },
];

const companyMoreItems = [
  { title: "OUR CORE PRINCIPLES", to: "/principles" },
  // { title: "OUR TEAM", to: "/team" },
  { title: "CONTACT US", to: "/contact" },
  { title: "CAREERS", to: "/careers" },
  // { title: "BLOG", to: "/blog" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActive, setMobileActive] = useState(null);
  const { user } = useAuth();

  const accountItems = user
    ? [{ title: "MY ACCOUNT", to: "/my-account" }]
    : [
      { title: "LOG IN", to: "/sign-in" },
      { title: "CREATE ACCOUNT", to: "/create-account" },
    ];

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileItem = (menu) => {
    setMobileActive(mobileActive === menu ? null : menu);
  };

  const linkClasses =
    "text-[#1a1a1a] hover:text-[#2D4DE8] py-3 text-base font-semibold uppercase transition duration-300";

  const mobileLinkClasses =
    "block text-[#1a1a1a] hover:text-[#2D4DE8] py-2 text-sm font-semibold uppercase transition duration-200";
  const dropdownAnimation =
    "absolute top-full bg-white rounded-lg shadow-xl border border-gray-100 z-10 transition-all duration-300 transform";

  const dropdownVisible = "opacity-100 translate-y-0 scale-100 pointer-events-auto";
  const dropdownHidden = "opacity-0 -translate-y-2 scale-95 pointer-events-none";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex justify-between items-center h-[70px]">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <Link to="/" className="flex items-center h-full" aria-label="Home">
              <img
                src={logoImg}
                alt="AiGENThix logo"
                className="mt-2 h-9 sm:h-11 w-auto object-contain block"
              />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-[#1a1a1a] hover:text-[#2D4DE8] focus:outline-none"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              <div
                className="relative flex items-center"
                onMouseEnter={() => toggleDropdown("products")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <Link to="/products" className={`${linkClasses} flex items-center`}>
                  PRODUCTS
                  <svg
                    className={`ml-1 h-3 w-3 transition-transform duration-300 ${activeDropdown === "products" ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>

                <div
                  className={`${dropdownAnimation} left-0 w-64 ${activeDropdown === "products" ? dropdownVisible : dropdownHidden
                    }`}
                >
                  {productsDropdownItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="block px-6 py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-blue-50 hover:text-[#2D4DE8] uppercase flex items-center justify-between group"
                    >
                      {item.title}
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              <div
                className="relative flex items-center"
                onMouseEnter={() => toggleDropdown("services")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <Link to="/services" className={`${linkClasses} flex items-center`}>
                  SERVICES
                  <svg
                    className={`ml-1 h-3 w-3 transition-transform duration-300 ${activeDropdown === "services" ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>

                <div
                  className={`${dropdownAnimation} left-0 w-80 ${activeDropdown === "services" ? dropdownVisible : dropdownHidden
                    }`}
                >
                  {serviceDropdownItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="block px-6 py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-blue-50 hover:text-[#2D4DE8] uppercase flex items-center justify-between group"
                    >
                      {item.title}
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              <div
                className="relative flex items-center"
                onMouseEnter={() => toggleDropdown("industries")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <Link to="/industries" className={`${linkClasses} flex items-center`}>
                  INDUSTRIES
                  <svg
                    className={`ml-1 h-3 w-3 transition-transform duration-300 ${activeDropdown === "industries" ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>

                <div
                  className={`${dropdownAnimation} left-0 w-72 ${activeDropdown === "industries" ? dropdownVisible : dropdownHidden
                    }`}
                >
                  {industriesDropdownItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.to}
                      className="block px-6 py-3 text-sm font-semibold text-[#1a1a1a] hover:bg-blue-50 hover:text-[#2D4DE8] uppercase flex items-center justify-between group"
                    >
                      {item.title}
                      <svg
                        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/learning-and-development" className={linkClasses}>
                L&D
              </Link>
              <Link to="/research-development" className={linkClasses}>
                R&D
              </Link>
              <Link to="/about" className={linkClasses}>
                ABOUT
              </Link>

              <div
                className="relative flex items-center"
                onMouseEnter={() => toggleDropdown("more")}
                onMouseLeave={() => toggleDropdown(null)}
              >
                <button className={`${linkClasses} flex items-center`}>
                  MORE
                  <svg
                    className={`ml-1 h-3 w-3 transition-transform duration-300 ${activeDropdown === "more" ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`${dropdownAnimation} left-1/2 -translate-x-1/2 w-60 ${activeDropdown === "more" ? dropdownVisible : dropdownHidden
                    }`}
                >
                  {companyMoreItems.map((item, index) => (
                    <React.Fragment key={item.title}>
                      <Link
                        to={item.to}
                        className="block px-4 py-3 text-sm font-bold text-[#1a1a1a] hover:bg-gray-50 uppercase"
                      >
                        {item.title}
                      </Link>
                      {index !== companyMoreItems.length - 1 && <hr className="my-0 border-gray-200" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center ml-4">
                <button
                  onClick={() => toggleDropdown("account")}
                  className="text-[#1a1a1a] hover:text-[#2D4DE8] transition duration-200 p-2 rounded-full"
                  aria-label="Account Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </button>

                <div
                  className={`${dropdownAnimation} right-0 w-60 ${activeDropdown === "account" ? dropdownVisible : dropdownHidden
                    }`}
                >
                  {accountItems.map((item, index) => (
                    <React.Fragment key={item.title}>
                      <Link
                        to={item.to}
                        className="block px-4 py-3 text-sm font-bold text-[#1a1a1a] hover:bg-gray-50 uppercase"
                      >
                        {item.title}
                      </Link>
                      {index !== accountItems.length - 1 && <hr className="my-0 border-gray-200" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-70px)] overflow-auto">
          <div className="flex flex-col space-y-2 p-4">
            <div>
              <Link
                to="/products"
                className={`${linkClasses} flex items-center justify-between w-full`}
                onClick={() => {
                  setIsOpen(false);
                  setMobileActive(null);
                }}
              >
                <span>PRODUCTS</span>
              </Link>
              <button
                onClick={() => toggleMobileItem('products')}
                className={`${mobileLinkClasses} flex items-center justify-between w-full pl-4`}
                aria-expanded={mobileActive === 'products'}
              >
                <span className="text-xs">View All Products</span>
                <svg
                  className={`ml-2 w-3 h-3 transform transition-transform duration-200 ${mobileActive === 'products' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileActive === 'products' && (
                <div className="pl-4 mt-2 space-y-1">
                  {productsDropdownItems.map((p) => (
                    <Link
                      key={p.to}
                      to={p.to}
                      className={`${mobileLinkClasses} pl-2`}
                      onClick={() => setIsOpen(false)}
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Link
                to="/services"
                className={`${linkClasses} flex items-center justify-between w-full`}
                onClick={() => {
                  setIsOpen(false);
                  setMobileActive(null);
                }}
              >
                <span>SERVICES</span>
              </Link>
              <button
                onClick={() => toggleMobileItem('services')}
                className={`${mobileLinkClasses} flex items-center justify-between w-full pl-4`}
                aria-expanded={mobileActive === 'services'}
              >
                <span className="text-xs">View All Services</span>
                <svg className={`ml-2 w-3 h-3 transform transition-transform duration-200 ${mobileActive === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileActive === 'services' && (
                <div className="pl-4 mt-2 space-y-1">
                  {serviceDropdownItems.map((s) => (
                    <Link key={s.to} to={s.to} className={`${mobileLinkClasses} pl-2`} onClick={() => setIsOpen(false)}>{s.title}</Link>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Link
                to="/industries"
                className={`${linkClasses} flex items-center justify-between w-full`}
                onClick={() => {
                  setIsOpen(false);
                  setMobileActive(null);
                }}
              >
                <span>INDUSTRIES</span>
              </Link>
              <button
                onClick={() => toggleMobileItem('industries')}
                className={`${mobileLinkClasses} flex items-center justify-between w-full pl-4`}
                aria-expanded={mobileActive === 'industries'}
              >
                <span className="text-xs">View All Industries</span>
                <svg className={`ml-2 w-3 h-3 transform transition-transform duration-200 ${mobileActive === 'industries' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileActive === 'industries' && (
                <div className="pl-4 mt-2 space-y-1">
                  {industriesDropdownItems.map((i) => (
                    <Link key={i.to} to={i.to} className={`${mobileLinkClasses} pl-2`} onClick={() => setIsOpen(false)}>{i.title}</Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/learning-and-development" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              Learning And Development
            </Link>
            <Link to="/research-development" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              Research And Development
            </Link>
            <Link to="/about" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              ABOUT
            </Link>
            <Link to="/principles" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              OUR CORE PRINCIPLES
            </Link>
            {/* <Link to="/team" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              OUR TEAM
            </Link> */}
            <Link to="/contact" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              CONTACT US
            </Link>
            <Link to="/careers" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              CAREERS
            </Link>
            {/* <Link to="/blog" className={mobileLinkClasses} onClick={() => setIsOpen(false)}>
              BLOG
            </Link> */}
            <hr className="border-gray-200" />

            {accountItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={mobileLinkClasses}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
