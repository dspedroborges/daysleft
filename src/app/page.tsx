'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Page() {
  return <Suspense>
    <HomePage />
  </Suspense>
}

function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const startParam: string | null = searchParams.get('start');
  const targetParam: string | null = searchParams.get('target');
  const titleParam: string | null = searchParams.get('title');

  const [startDate, setStartDate] = useState<string>(startParam || '');
  const [targetDate, setTargetDate] = useState<string>(targetParam || '');
  const [inputStartDate, setInputStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [inputTargetDate, setInputTargetDate] = useState<string>('');
  const [title, setTitle] = useState<string>(titleParam || '');
  const [inputTitle, setInputTitle] = useState<string>(titleParam || '');

  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [passedDays, setPassedDays] = useState<number>(0);

  useEffect(() => {
    if (startDate && targetDate) {
      const start = new Date(startDate);
      const target = new Date(targetDate);
      const today = new Date();

      const diffTime = target.getTime() - start.getTime();
      const total = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(total);

      let passed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (passed < 0) passed = 0;
      if (passed > total) passed = total;
      setPassedDays(passed);
    }
  }, [startDate, targetDate, inputStartDate, inputTargetDate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputStartDate && inputTargetDate) {
      setStartDate(inputStartDate);
      setTargetDate(inputTargetDate);
      setTitle(inputTitle);
      const url = `/?start=${inputStartDate}&target=${inputTargetDate}&title=${encodeURIComponent(inputTitle)}`;
      router.push(url);
      router.refresh();
    }
  };

  if (!startDate || !targetDate) {
    return (
      <div className="p-5 lg:w-1/2 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Insira as informações</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Título da Página:</label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputTitle(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Data de Início:</label>
            <input
              type="date"
              value={inputStartDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputStartDate(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Data final:</label>
            <input
              type="date"
              value={inputTargetDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputTargetDate(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            Enviar
          </button>
        </form>
      </div>
    );
  }

  const remainingDays = totalDays !== null ? totalDays - passedDays : 0;

  return (
    <div className="p-5 lg:w-1/3 mx-auto">
      <h1 className="text-2xl font-bold mb-2">{title || 'Contagem de Dias'}</h1>
      <h2 className="text-lg mb-2">
        De {new Date(startDate + "T12:00:00").toLocaleDateString()} até {new Date(targetDate + "T12:00:00").toLocaleDateString()}
      </h2>
      <h3 className="text-xl mb-4">{remainingDays} dias restantes</h3>
      <div className="grid grid-cols-10 w-auto gap-1">
        {totalDays !== null &&
          Array.from({ length: totalDays }).map((_, index) => {
            const isPassed = index < passedDays;
            return (
              <div
                key={index}
                className={`w-8 h-8 m-0.5 border border-gray-700 ${isPassed ? 'bg-green-500' : 'bg-transparent'}`}
              ></div>
            );
          })}
      </div>
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer w-full"
        onClick={() => {
          router.push("/");
          setStartDate("");
          setTargetDate("");
          setTitle("");
        }}
      >
        Novo
      </button>
    </div>
  );
}
