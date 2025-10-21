import React from "react";

const MilestoneBlock: React.FC = () => {
  return (
    <div className="bg-neutral-100 rounded-lg shadow-md p-6">
      <h4 className="text-xl font-bold text-primary-800 mb-4">
        Key Milestones
      </h4>
      <ul className="space-y-4 text-left">
        <li>
          <span className="text-secondary-600 font-semibold">1948</span> –
          <strong> Consecration</strong>
          <br />
          Radlett Lodge No. 6652 was consecrated by Admiral Sir Lionel Halsey,
          RW Provincial Grand Master.
        </li>
        <li>
          <span className="text-secondary-600 font-semibold">1973</span> –
          <strong> 25th Anniversary</strong>
          <br />
          Celebrated 25 years with a special meeting attended by the Provincial
          Grand Master.
        </li>
        <li>
          <span className="text-secondary-600 font-semibold">1998</span> –
          <strong> 50th Anniversary</strong>
          <br />
          Golden Jubilee celebration with commemorative jewels issued to all
          members.
        </li>
        <li>
          <span className="text-secondary-600 font-semibold">2023</span> –
          <strong> 75th Anniversary</strong>
          <br />
          Diamond Jubilee celebration and special commemorative meeting.
        </li>
      </ul>
    </div>
  );
};

export default MilestoneBlock;
