import { PlusIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button } from '../../components/common';
import Solution from '../../components/common/Solution';
import { SolutionSkeleton } from '../../components/skeleton';
import solutionService from '../../services/solutionService';
import { ISolutionResponse } from '../../types/response/solution';
import './Solution.scss';
import { paths } from '../../constant';
const Solutions: React.FC = () => {
  const [page] = useState<number>(1);
  const { data: solutionsData, isPending } = useQuery({
    queryKey: [paths.QUERY_KEY.solutionList],
    queryFn: async () => {
      const response = await solutionService.getAll({ page });
      const responseData = response?.data?.data?.solutions;
      return responseData || [];
    },
  });

  const COLUMN = 4;
  let groupedSolutions: ISolutionResponse[][] = [];

  if (solutionsData) {
    groupedSolutions = Array.from({ length: COLUMN }, (_, i) =>
      solutionsData.filter((_, index) => index % COLUMN === i),
    );
  }

  return (
    <>
      <div className="container-solution-list-page">
        <div className="header">
          <div className="title">Solution List</div>
          <Button
            style={{ width: 'fit-content' }}
            label="Filter"
            buttonSize="small"
            iconPosition="left"
            styleType="secondary"
            Icon={() => <PlusIcon />}
          />
        </div>
        <div className="solution-list">
          {isPending &&
            Array.from({ length: 4 }).map((_, colIndex) => (
              <div key={colIndex} className="cols">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SolutionSkeleton key={index} />
                ))}
              </div>
            ))}

          {!isPending &&
            groupedSolutions.length !== 0 &&
            groupedSolutions.map((column, colIndex) => (
              <div key={colIndex} className="cols">
                {column.map((solutionItem, index) => (
                  <Solution
                    key={index}
                    isShowDescription
                    solution={solutionItem}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default Solutions;
