export function calculatePriority(severity: string, similarity: number, clusterSize: number) {
  let finalPriority = severity;

  if (severity === 'Critical' && similarity > 85) {
    finalPriority = 'Critical'; // Maintain or enforce
  }

  if (clusterSize > 3) {
    finalPriority = 'Critical'; // Bulk escalation
  }

  const recommendations = [];
  if (finalPriority === 'Critical') {
    recommendations.push("Immediate escalation recommended");
  }
  if (clusterSize > 1) {
    recommendations.push("Multiple nearby complaints detected");
  } else {
    recommendations.push("Standard response workflow initiated");
  }

  return {
    priority: finalPriority,
    recommendations
  };
}
