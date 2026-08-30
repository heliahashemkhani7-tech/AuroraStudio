import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ElectricBorder from "../animiations/ElectricBorder";
import { useTranslation } from "react-i18next";

type Project = {
  title: string;
  category: string;
  technology: string;
  description: string;
  link: string;
  detail: string;
};

type Props = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: Props) {
  const { t } = useTranslation();
  const columns = 3;

  const row = Math.floor(index / columns);
  const positionInRow = index % columns;

  const getHeight = () => {
    if (row % 2 === 0) {
      return positionInRow === 1 ? "lg:h-[290px]" : "lg:h-[350px]";
    }

    return positionInRow === 1 ? "lg:h-[350px]" : "lg:h-[290px]";
  };

  return (
    <div
      className="
          relative
          h-[250px]
          lg:h-full
          [perspective:1000px]
          group
        "
    >
      <div
        className="
            relative
            h-full
            w-full
            transition-transform
            duration-700
            [transform-style:preserve-3d]
            group-hover:[transform:rotateY(180deg)]
          "
      >
        {/* ================= FRONT ================= */}
        <ElectricBorder
          className={`my-2 cursor-pointer max-w-xs mx-5 md:max-w-xl ${getHeight()}`}
          color="var(--text)"
          chaos={0.03}
        >
          <Card
            className={`flex justify-between [--card-spacing:0]  h-[250px] ${getHeight()}`}
          >
            <div>
              <img
                src={project.link}
                alt={project.title}
                className="w-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <CardContent
              className={`top-35 md:top-30 lg:top-45 absolute pl-8 rtl:right-3 flex flex-col gap-2   w-full`}
            >
              <div className="flex gap-2 text-white w-full mb-2" dir="ltr">
                <Badge dir="ltr" className="text-badge-text">
                  {project.category}
                </Badge>

                <Badge className="bg-badge-dark">{project.technology}</Badge>
              </div>

              <h3 className="text-xl font-semibold text-text mb-2" dir="ltr">
                {project.title}
              </h3>

              <p className="text-sm">{project.description}</p>
            </CardContent>
          </Card>
        </ElectricBorder>

        {/* ================= BACK ================= */}

        <Card
          className={`
              absolute
              inset-0
              h-[250px]
              ${getHeight()}
              overflow-hidden
              [backface-visibility:hidden]
              [transform:rotateY(180deg)]
              [--card-spacing:0]
            `}
        >
          <img
            src={project.link}
            alt={project.title}
            className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
              "
          />

          <div className="absolute inset-0 bg-back-card" />
          <CardContent
            className="
                relative
                z-10
                flex
                h-full
                w-full
                flex-col
                justify-end
                gap-3
                p-5
"
          >
            <h3 className="text-2xl font-semibold text-span">
              {project.title}
            </h3>

            <p className="text-sm leading-6 text-text">{project.detail}</p>

            <button
              className="
                  mt-2
                  w-fit
                  rounded-full
                  border
                  border-white
                  px-4
                  py-2
                  text-sm
                  text-text
                  transition
                  hover:bg-white
                  hover:text-black
                "
            >
              {t("portfolio.btn")}{" "}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
