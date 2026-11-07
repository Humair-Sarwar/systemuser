import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PublishIcon from "@mui/icons-material/Publish";

const ModernConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "linear-gradient(90deg, #10b981 0%, #0f172a 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: "#10b981",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    transition: "all 0.3s ease",
  },
}));

const ModernStepIconRoot = styled("div")(({ ownerState }) => ({
  backgroundColor: "#f1f5f9",
  zIndex: 1,
  color: "#64748b",
  width: 42,
  height: 42,
  display: "flex",
  borderRadius: "14px",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #e2e8f0",
  transition: "all 0.25s ease",
  ...(ownerState.active && {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderColor: "#0f172a",
    boxShadow: "0 8px 20px -4px rgba(15, 23, 42, 0.35)",
  }),
  ...(ownerState.completed && {
    backgroundColor: "#10b981",
    color: "#ffffff",
    borderColor: "#10b981",
    boxShadow: "0 6px 16px -4px rgba(16, 185, 129, 0.35)",
  }),
}));

function ModernStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: completed ? (
      <Check sx={{ fontSize: 20 }} />
    ) : (
      <PostAddIcon sx={{ fontSize: 20 }} />
    ),
    2: <PublishIcon sx={{ fontSize: 20 }} />,
  };

  return (
    <ModernStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ModernStepIconRoot>
  );
}

ModernStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = ["1. Product Details", "2. Stock and Publish"];

export default function Steppers({ step2 }) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Stepper activeStep={step2 ? 1 : 0} connector={<ModernConnector />}>
        {steps.map((label, idx) => {
          const isActive = (step2 ? 1 : 0) === idx;
          const isCompleted = step2 && idx === 0;
          return (
            <Step key={label}>
              <StepLabel
                StepIconComponent={ModernStepIcon}
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: "14px",
                    fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                    color: isActive
                      ? "#0f172a !important"
                      : isCompleted
                        ? "#10b981 !important"
                        : "#64748b !important",
                    letterSpacing: "-0.01em",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Stack>
  );
}
