import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export function TimePicker({ value, onChange, placeholder = "Pick a time" }: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 9, minute: 0, period: "AM" };
    
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      return {
        hour: parseInt(match[1]),
        minute: parseInt(match[2]),
        period: match[3].toUpperCase(),
      };
    }
    return { hour: 9, minute: 0, period: "AM" };
  };

  const formatTime = (hour: number, minute: number, period: string) => {
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const currentTime = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(currentTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(currentTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(currentTime.period);

  const handleSelect = () => {
    const formattedTime = formatTime(selectedHour, selectedMinute, selectedPeriod);
    onChange(formattedTime);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-3">
          <div className="flex flex-col">
            <div className="text-xs font-medium text-center mb-2 text-muted-foreground">Hour</div>
            <ScrollArea className="h-[180px] w-[60px] border rounded-md">
              <div className="p-1">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant={selectedHour === hour ? "default" : "ghost"}
                    className="w-full h-8 justify-center mb-1"
                    onClick={() => setSelectedHour(hour)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium text-center mb-2 text-muted-foreground">Min</div>
            <ScrollArea className="h-[180px] w-[60px] border rounded-md">
              <div className="p-1">
                {minutes.filter((m) => m % 5 === 0).map((minute) => (
                  <Button
                    key={minute}
                    variant={selectedMinute === minute ? "default" : "ghost"}
                    className="w-full h-8 justify-center mb-1"
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium text-center mb-2 text-muted-foreground">Period</div>
            <div className="flex flex-col gap-2">
              {periods.map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  className="w-[60px] h-12"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t p-2">
          <Button className="w-full" onClick={handleSelect}>
            Select Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
