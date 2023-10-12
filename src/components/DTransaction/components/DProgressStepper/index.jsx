import './index.css';

import {
  Check,
  CheckCircle,
  CircleSharp,
  RadioButtonChecked,
  RadioButtonUnchecked
} from '@mui/icons-material';
import { DEventService, DEvents } from '../../../../services/DEventService';
import React, { useEffect, useState } from 'react';
import { Step, StepConnector, StepContent, StepLabel, Stepper } from '@mui/material';

import { useNavigate } from 'react-router-dom';

export default function DProgressStepper({ steps = [] }) {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    setActiveStep(activeStep);
  }, [activeStep]);

  const [activeSub, setActiveSub] = useState(null);
  useEffect(() => {
    setActiveSub(activeSub);
  }, [activeSub]);

  const updateProgress = e => {
    steps.forEach((item, index) => {
      if (
        item.label === e.detail.label &&
        (e.detail.flowId === null || Number(e.detail.flowId) === item.flowId)
      ) {
        item.status = 'inprogress';
        setActiveStep(index);
        //User selected the root level but if it has substeps we need to highlight first child
        if (item.subSteps?.length) {
          item.subSteps[0].status = 'inprogress';
        }
      } else if (item.subSteps?.length) {
        let found = false;
        item.subSteps.forEach((sub, idx) => {
          if (
            sub.label === e.detail.label &&
            (e.detail.flowId === null || Number(e.detail.flowId) === sub.flowId)
          ) {
            setActiveStep(index);
            setActiveSub(idx);
            sub.status = 'inprogress';
            item.status = 'inprogress';
            found = true;
          } else {
            if (sub.status === 'inprogress') {
              sub.status = 'complete';
            }
          }
        });

        if (!found) {
          if (item.status === 'inprogress') {
            item.status = 'complete';
          }
        }
      } else {
        if (item.status === 'inprogress') {
          item.status = 'complete';
        }
      }
    });
  };

  useEffect(() => {
    DEventService.subscribe(DEvents.PROGRESS, updateProgress);
    return () => {
      DEventService.unsubscribe(DEvents.PROGRESS, updateProgress);
    };
  }, [updateProgress]);

  const navigate = useNavigate();

  const stepSelect = e => {
    navigate(e);
  };

  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      orientation='vertical'
      // connector={<StepConnector />}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          className={`step-wrapper ${step.status} ${
            index < steps.length - 1 || step.subSteps ? '' : 'last-wrapper'
          }`}
        >
          <StepLabel StepIconProps={step} StepIconComponent={StepIcon}>
            <div
              onClick={step.status === 'complete' ? () => stepSelect(step.path) : null}
              className={
                step.status === 'complete' || step.status === 'inprogress'
                  ? 'stepperlabel stepper-label'
                  : 'stepperlabel'
              }
            >
              {step.label}
            </div>
            {step.status === 'inprogress' && <div className='steppersubitile'>In Progress</div>}
          </StepLabel>
          <StepContent className='stepper-sub-step'>
            {step.status === 'inprogress' &&
              step.subSteps &&
              step.subSteps.map((subStep, i) => {
                return (
                  <div
                    key={i}
                    className={`sub-step-label ${subStep.status === 'inprogress' && 'active'}  ${
                      subStep.status === 'incomplete' && 'incomplete'
                    }`}
                  >
                    {subStep.status === 'complete' && <Check className='sub-stepper-icon' />}
                    {subStep.status === 'inprogress' && (
                      <CircleSharp className='sub-stepper-icon' />
                    )}
                    <div
                      onClick={
                        subStep.status === 'complete' ? () => stepSelect(subStep.path) : null
                      }
                      className={
                        subStep.status === 'complete' || subStep.status === 'inprogress'
                          ? 'sub-stepper-label'
                          : ''
                      }
                    >
                      {subStep.label}
                    </div>
                  </div>
                );
              })}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}

function StepIcon(props) {
  const { status } = props;
  return (
    <div className='stepperroot'>
      {status === 'complete' ? (
        <CheckCircle className='steppercompleted' />
      ) : status === 'inprogress' ? (
        <RadioButtonChecked />
      ) : status === 'begun' ? (
        <RadioButtonUnchecked className='stepbegun' />
      ) : (
        <RadioButtonUnchecked className='stepincomplete' />
      )}
    </div>
  );
}
