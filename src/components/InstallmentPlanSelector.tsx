import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PaymentPlan {
  id: string;
  plan_name: string;
  total_amount: number;
  installment_count: number;
  installment_amount: number;
}

interface InstallmentPlanSelectorProps {
  plans: PaymentPlan[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string | null) => void;
  coursePrice: number;
}

export const InstallmentPlanSelector = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  coursePrice,
}: InstallmentPlanSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Your Payment Plan</h3>
      
      {/* Full Payment Option */}
      <Card
        className={`p-4 cursor-pointer transition-all border-2 ${
          selectedPlanId === null
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onClick={() => onSelectPlan(null)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">Pay in Full</h4>
              <Badge variant="secondary">Save More</Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              ₦{coursePrice.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              One-time payment, instant full access
            </p>
          </div>
          {selectedPlanId === null && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>
      </Card>

      {/* Installment Plans */}
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`p-4 cursor-pointer transition-all border-2 ${
            selectedPlanId === plan.id
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => onSelectPlan(plan.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{plan.plan_name}</h4>
                <Badge variant="outline">Flexible</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  ₦{plan.installment_amount.toLocaleString()}/month
                </p>
                <p className="text-sm text-muted-foreground">
                  Pay over {plan.installment_count} months
                </p>
                <p className="text-xs text-muted-foreground">
                  Total: ₦{plan.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
            {selectedPlanId === plan.id && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        </Card>
      ))}

      <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="font-semibold mb-1">Installment Plan Details:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>First payment required to start learning</li>
          <li>Subsequent payments due monthly</li>
          <li>Continue access while payments are current</li>
          <li>Certificate awarded upon completion of all payments</li>
        </ul>
      </div>
    </div>
  );
};
