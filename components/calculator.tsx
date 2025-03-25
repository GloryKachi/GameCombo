"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(0);
  const [convertFrom, setConvertFrom] = useState("USD");
  const [convertTo, setConvertTo] = useState("EUR");
  const [convertValue, setConvertValue] = useState("0");
  const [convertResult, setConvertResult] = useState("0");
  const [areaUnit, setAreaUnit] = useState("m²");
  const [areaLength, setAreaLength] = useState("0");
  const [areaWidth, setAreaWidth] = useState("0");
  const [areaResult, setAreaResult] = useState("0");
  const [loanAmount, setLoanAmount] = useState("0");
  const [loanRate, setLoanRate] = useState("0");
  const [loanTerm, setLoanTerm] = useState("0");
  const [loanResult, setLoanResult] = useState("0");
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [dateDiff, setDateDiff] = useState("0");
  const [originalPrice, setOriginalPrice] = useState("0");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [discountResult, setDiscountResult] = useState("0");

  const handleInput = (value) => {
    setDisplay((prev) => (prev === "0" ? value : prev + value));
  };

  const handleClear = () => {
    setDisplay("0");
  };

  const handleCalculate = () => {
    try {
      const result = eval(display.replace(/x/g, "*"));
      setDisplay(result.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const handleMemoryOperation = (operation) => {
    switch (operation) {
      case "M+":
        setMemory(memory + parseFloat(display));
        break;
      case "M-":
        setMemory(memory - parseFloat(display));
        break;
      case "MR":
        setDisplay(memory.toString());
        break;
      case "MC":
        setMemory(0);
        break;
    }
  };

  const handleScientificOperation = (operation) => {
    switch (operation) {
      case "sin":
      case "cos":
      case "tan":
        setDisplay(`Math.${operation}(${display})`);
        break;
      case "log":
        setDisplay(`Math.log10(${display})`);
        break;
      case "ln":
        setDisplay(`Math.log(${display})`);
        break;
      case "sqrt":
        setDisplay(`Math.sqrt(${display})`);
        break;
      case "x^2":
        setDisplay(`Math.pow(${display}, 2)`);
        break;
      case "x^y":
        setDisplay(`${display}**`);
        break;
    }
  };

  const handleCurrencyConvert = () => {
    // In a real app, you would use an API to get current exchange rates
    const rates = {
      USD: { EUR: 0.85, GBP: 0.74, JPY: 110.14, NGN: 461.5 },
      EUR: { USD: 1.18, GBP: 0.87, JPY: 129.55, NGN: 541.76 },
      GBP: { USD: 1.36, EUR: 1.15, JPY: 149.13, NGN: 616.77 },
      JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0067, NGN: 3.1 },
      NGN: { USD: 0.0022, EUR: 0.0018, GBP: 0.0016, JPY: 0.32 },
    };
    const result = parseFloat(convertValue) * rates[convertFrom][convertTo];
    setConvertResult(result.toFixed(2));
  };

  const handleAreaCalculate = () => {
    const length = parseFloat(areaLength);
    const width = parseFloat(areaWidth);
    let result = length * width;
    if (areaUnit === "cm²") result /= 10000;
    if (areaUnit === "km²") result *= 1000000;
    setAreaResult(result.toFixed(2));
  };

  const handleLoanCalculate = () => {
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(loanRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;
    const result =
      (amount * rate * Math.pow(1 + rate, term)) /
      (Math.pow(1 + rate, term) - 1);
    setLoanResult(result.toFixed(2));
  };

  const handleDateCalculate = () => {
    const diffTime = Math.abs(dateTo.getTime() - dateFrom.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDateDiff(diffDays.toString());
  };

  const handleDiscountCalculate = () => {
    const original = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    const discountAmount = original * (discount / 100);
    const finalPrice = original - discountAmount;
    setDiscountResult(finalPrice.toFixed(2));
  };

  const basicButtons = [
    "C",
    "(",
    ")",
    "/",
    "7",
    "8",
    "9",
    "x",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  const scientificButtons = [
    "sin",
    "cos",
    "tan",
    "log",
    "ln",
    "sqrt",
    "x^2",
    "x^y",
  ];

  const memoryButtons = ["MC", "MR", "M+", "M-"];

  return (
    <div className="max-w-md mx-auto bg-gray-100 rounded-3xl shadow-xl overflow-hidden">
      <h2 className="p-3 text-center font-semibold text-2xl">
        Glory Calculator
      </h2>
      <Tabs defaultValue="basic" className="p-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="scientific">Scientific</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-right text-3xl font-light">{display}</div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {memoryButtons.map((btn) => (
              <Button
                key={btn}
                onClick={() => handleMemoryOperation(btn)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                {btn}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {basicButtons.map((btn) => (
              <Button
                key={btn}
                onClick={() => {
                  if (btn === "C") handleClear();
                  else if (btn === "=") handleCalculate();
                  else handleInput(btn);
                }}
                className={`text-xl font-light ${
                  ["/", "x", "-", "+", "="].includes(btn)
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : ["C", "(", ")"].includes(btn)
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                    : "bg-white hover:bg-gray-200 text-gray-800"
                } ${btn === "0" ? "col-span-2" : ""}`}
              >
                {btn}
              </Button>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="scientific">
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="text-right text-3xl font-light">{display}</div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {scientificButtons.map((btn) => (
              <Button
                key={btn}
                onClick={() => handleScientificOperation(btn)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                {btn}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {basicButtons.map((btn) => (
              <Button
                key={btn}
                onClick={() => {
                  if (btn === "C") handleClear();
                  else if (btn === "=") handleCalculate();
                  else handleInput(btn);
                }}
                className={`text-xl font-light ${
                  ["/", "x", "-", "+", "="].includes(btn)
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : ["C", "(", ")"].includes(btn)
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                    : "bg-white hover:bg-gray-200 text-gray-800"
                } ${btn === "0" ? "col-span-2" : ""}`}
              >
                {btn}
              </Button>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <Tabs defaultValue="currency">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="currency">Currency</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
              <TabsTrigger value="date">Date</TabsTrigger>
              <TabsTrigger value="discount">Discount</TabsTrigger>
            </TabsList>
            <TabsContent value="currency">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="convertFrom">From</Label>
                    <Select value={convertFrom} onValueChange={setConvertFrom}>
                      <SelectTrigger id="convertFrom">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="NGN">NGN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="convertTo">To</Label>
                    <Select value={convertTo} onValueChange={setConvertTo}>
                      <SelectTrigger id="convertTo">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="NGN">NGN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="convertValue">Amount</Label>
                  <Input
                    id="convertValue"
                    type="number"
                    value={convertValue}
                    onChange={(e) => setConvertValue(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCurrencyConvert}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Convert
                </Button>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-right text-3xl font-light">
                    {convertResult}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="area">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="areaUnit">Unit</Label>
                  <Select value={areaUnit} onValueChange={setAreaUnit}>
                    <SelectTrigger id="areaUnit">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m²">m²</SelectItem>
                      <SelectItem value="cm²">cm²</SelectItem>
                      <SelectItem value="km²">km²</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="areaLength">Length</Label>
                  <Input
                    id="areaLength"
                    type="number"
                    value={areaLength}
                    onChange={(e) => setAreaLength(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="areaWidth">Width</Label>
                  <Input
                    id="areaWidth"
                    type="number"
                    value={areaWidth}
                    onChange={(e) => setAreaWidth(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAreaCalculate}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Calculate Area
                </Button>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-right text-3xl font-light">
                    {areaResult} {areaUnit}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="finance">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="loanRate">Interest Rate (%)</Label>
                  <Input
                    id="loanRate"
                    type="number"
                    value={loanRate}
                    onChange={(e) => setLoanRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleLoanCalculate}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Calculate Monthly Payment
                </Button>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-right text-3xl font-light">
                    ${loanResult}/month
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="date">
              <div className="space-y-4">
                <div>
                  <Label>From Date</Label>
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <Label>To Date</Label>
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    className="rounded-md border"
                  />
                </div>
                <Button
                  onClick={handleDateCalculate}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Calculate Days Between
                </Button>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-right text-3xl font-light">
                    {dateDiff} days
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="discount">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="discountPercent">Discount Percentage</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleDiscountCalculate}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Calculate Discounted Price
                </Button>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-right text-3xl font-light">
                    ${discountResult}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
