import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const severity = searchParams.get('severity') || 'Low';
  const similarity = parseInt(searchParams.get('similarity') || '0', 10);

  const recommendations = [];

  if (severity === 'Critical') {
    recommendations.push("Immediate escalation to emergency response teams recommended.");
    recommendations.push("High citizen impact detected. Prioritize SLA.");
  } else if (severity === 'High') {
    recommendations.push("Route to priority queue for assigned department.");
  }

  if (similarity > 85) {
    recommendations.push("Duplicate complaint cluster identified. Merge tickets to prevent duplicate work.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Standard processing workflow initiated.");
  }

  return NextResponse.json({ recommendations });
}
