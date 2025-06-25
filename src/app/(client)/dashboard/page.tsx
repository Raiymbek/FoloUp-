"use client";

import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { InterviewService } from "@/services/interviews.service";
import { ClientService } from "@/services/clients.service";
import { ResponseService } from "@/services/responses.service";
import { useInterviews } from "@/contexts/interviews.context";
import Modal from "@/components/dashboard/Modal";
import { Gem, Plus } from "lucide-react";
import Image from "next/image";

function Interviews() {
  const { interviews, interviewsLoading } = useInterviews();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [allowedResponsesCount, setAllowedResponsesCount] =
    useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function InterviewsLoader() {
    return (
      <>
        <div className="flex flex-row">
          <div className="h-60 w-56 ml-1 mr-3 mt-3 flex-none animate-pulse rounded-xl bg-gray-300" />
          <div className="h-60 w-56 ml-1 mr-3  mt-3 flex-none animate-pulse rounded-xl bg-gray-300" />
          <div className="h-60 w-56 ml-1 mr-3 mt-3 flex-none animate-pulse rounded-xl bg-gray-300" />
        </div>
      </>
    );
  }

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (organization?.id) {
          const data = await ClientService.getOrganizationById(organization.id);
          // if (data?.plan) {
          //   setCurrentPlan(data.plan);
          //   if (data.plan === "free_trial_over") {
          //     setIsModalOpen(true);
          //   }
          // }
          // if (data?.allowed_responses_count) {
          //   setAllowedResponsesCount(data.allowed_responses_count);
          // }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchOrganizationData();
  }, [organization]);

  useEffect(() => {
    const fetchResponsesCount = async () => {
      // if (!organization || currentPlan !== "free") {
      //   return;
      // }

      // setLoading(true);
      // try {
      //   const totalResponses =
      //     await ResponseService.getResponseCountByOrganizationId(
      //       organization.id,
      //     );
      //   const hasExceededLimit = totalResponses >= allowedResponsesCount;
      //   if (hasExceededLimit) {
      //     setCurrentPlan("free_trial_over");
      //     await InterviewService.deactivateInterviewsByOrgId(organization.id);
      //     await ClientService.updateOrganization(
      //       { plan: "free_trial_over" },
      //       organization.id,
      //     );
      //   }
      // } catch (error) {
      //   console.error("Error fetching responses:", error);
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchResponsesCount();
  }, [organization, currentPlan, allowedResponsesCount]);

  return (
    <main className="p-8 pt-0 ml-12 mr-auto rounded-md">
      <div className="flex flex-col items-left">
        <h2 className="mr-2 text-2xl font-semibold tracking-tight mt-8">
          Мои интервью
        </h2>
        <h3 className=" text-sm tracking-tight text-gray-600 font-medium ">
          Начните получать ответы прямо сейчас!
        </h3>
        <div className="relative flex items-center mt-1 flex-wrap">
          {/* {currentPlan == "free_trial_over" ? (
            <Card className=" flex bg-gray-200 items-center border-dashed border-gray-700 border-2 hover:scale-105 ease-in-out duration-300 h-60 w-56 ml-1 mr-3 mt-4 rounded-xl shrink-0 overflow-hidden shadow-md">
              <CardContent className="flex items-center flex-col mx-auto">
                <div className="flex flex-col justify-center items-center w-full overflow-hidden">
                  <Plus size={90} strokeWidth={0.5} className="text-gray-700" />
                </div>
                <CardTitle className="p-0 text-md text-center">
                  Вы не можете создавать новые интервью, пока не обновите план
                </CardTitle>
              </CardContent>
            </Card>
          ) : ( */}
            <CreateInterviewCard />
          {/* )} */}
          {interviewsLoading || loading ? (
            <InterviewsLoader />
          ) : (
            <>
              {/* {isModalOpen && (
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-center text-indigo-600">
                      <Gem />
                    </div>
                    <h3 className="text-xl font-semibold text-center">
                      Обновите до Pro
                    </h3>
                    <p className="text-l text-center">
                      Вы достигли лимита бесплатного пробного периода. Пожалуйста, обновите до Pro, чтобы продолжить использовать наши функции.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-center items-center">
                        <Image
                          src={"/premium-plan-icon.png"}
                          alt="Graphic"
                          width={299}
                          height={300}
                        />
                      </div>

                      <div className="grid grid-rows-2 gap-2">
                        <div className="p-4 border rounded-lg">
                          <h4 className="text-lg font-medium">Бесплатный план</h4>
                          <ul className="list-disc pl-5 mt-2">
                            <li>10 ответов</li>
                            <li>Базовая поддержка</li>
                            <li>Ограниченные функции</li>
                          </ul>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="text-lg font-medium">Pro план</h4>
                          <ul className="list-disc pl-5 mt-2">
                            <li>Гибкая оплата за ответ</li>
                            <li>Приоритетная поддержка</li>
                            <li>Все функции</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <p className="text-l text-center">
                      Свяжитесь с{" "}
                      <span className="font-semibold">founders@folo-up.co</span>{" "}
                      для обновления вашего плана.
                    </p>
                  </div>
                </Modal>
              )} */}
              {interviews.map((item) => (
                <InterviewCard
                  id={item.id}
                  interviewerId={item.interviewer_id}
                  key={item.id}
                  name={item.name}
                  url={item.url ?? ""}
                  readableSlug={item.readable_slug}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Interviews;
