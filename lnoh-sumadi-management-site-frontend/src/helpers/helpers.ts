/* eslint-disable no-param-reassign */
import { Step } from 'components/stepper/Stepper';

const mergeRecursive = (obj1: any, obj2: any) => {
  const newObject = { ...obj1 };
  const keys = Object.keys(obj2);

  keys.forEach((element) => {
    try {
      if (obj2[element].constructor === Object) {
        newObject[element] = mergeRecursive(newObject[element], obj2[element]);
      } else {
        newObject[element] = obj2[element];
      }
    } catch (e) {
      newObject[element] = obj2[element];
    }
  });

  return newObject;
};

export const changeSteps = (steps: Step[], currentStep: number, nextStep: number) => {
  const updateSteps = steps.map((element: Step) => {
    if (element.step === currentStep) {
      element.completed = currentStep < nextStep;
      element.active = false;
    } else if (element.step === nextStep) {
      element.completed = false;
      element.active = true;
    }
    return element;
  });
  return updateSteps;
};

export default mergeRecursive;
