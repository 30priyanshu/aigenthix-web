import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../IMAGES/Products page images/project.webp";
import SEO from "../SEO";
import {
  FaProjectDiagram,
  FaTasks,
  FaStream,
  FaTable,
  FaCalendarAlt,
  FaUserShield
} from "react-icons/fa";
import LiteYouTube from "../LiteYouTube";

const demoVideo =
  "https://www.youtube.com/embed/2QH4JGFdzZ0?si=4jVpmiIUHDxcAHOd";

const ProjectManagementTool = () => {
  return (
    <>
      <SEO
        title="Project Management Tool"
        description="A unified, real-time project management platform that combines task boards, timelines, data grids, and team calendars into a single powerful workspace for seamless collaboration and execution."
        url="/products/project-management"
        image="/project-management-og.jpg"
      />

      <div className="min-h-screen bg-gray-50">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="h-64 md:h-96 w-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImg})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* CONTENT CARD */}
          <div className="max-w-6xl mx-auto -mt-24 relative z-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-12">
              {/* TITLE */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Project Management Tool
                </h1>
                <p className="text-gray-700 leading-relaxed">
                  A unified, real-time project management platform that combines
                  task boards, timelines, data grids, and team calendars into a
                  single powerful workspace for seamless collaboration and
                  execution.
                </p>
              </div>

              {/* FEATURE CARDS */}
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Platform Capabilities
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: FaProjectDiagram,
                      title: "Project Workspace",
                      desc: "Centralized hub with project details, members, milestones, budgets, and live updates."
                    },
                    {
                      icon: FaTasks,
                      title: "Kanban Taskboard",
                      desc: "Drag-and-drop tasks with priorities, statuses, and instant real-time syncing."
                    },
                    {
                      icon: FaStream,
                      title: "Gantt Timeline",
                      desc: "Visualize tasks across projects with dependencies and progress tracking."
                    },
                    {
                      icon: FaTable,
                      title: "Data Grid Sheets",
                      desc: "Excel-like tables with live multi-user editing and customization."
                    },
                    {
                      icon: FaCalendarAlt,
                      title: "Team Calendar",
                      desc: "Plan events, manage deadlines, and track team availability."
                    },
                    {
                      icon: FaUserShield,
                      title: "Role-Based Access",
                      desc: "Secure admin and member roles with granular permission control."
                    }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 border rounded-xl p-6 hover:shadow-lg transition duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <Icon className="text-xl text-gray-700 mt-1 shrink-0" />

                          <div>
                            <h4 className="font-semibold text-lg mb-1">
                              {item.title}
                            </h4>

                            <p className="text-sm text-gray-600">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DEMO VIDEO */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Platform Demo</h2>
                <p className="text-gray-600 mb-6">
                  See how teams manage projects using Kanban boards, Gantt
                  timelines, data grids, and real-time collaboration tools.
                </p>

                <div className="relative rounded-xl overflow-hidden shadow-lg border aspect-video">
                  <LiteYouTube src={demoVideo} title="Project Management Demo" />
                </div>
              </div>

              {/* HIGHLIGHTS */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Built for Real-Time Collaboration
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Live updates across all modules using real-time sync</li>
                  <li>Instant task changes visible to all team members</li>
                  <li>Designed for startups, enterprises, and remote teams</li>
                  <li>Scales from small teams to large organizations</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow"
                >
                  Try for Free
                </Link>
                <Link
                  to="/products"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProjectManagementTool;
