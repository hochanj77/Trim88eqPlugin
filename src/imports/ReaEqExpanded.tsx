import svgPaths from "./svg-p77b7orrvu";
import imgImage1 from "figma:asset/3bfec708c4860ee56a310221add48d691f7e65ff.png";

function PinIcn() {
  return (
    <div className="absolute h-[16.339px] left-[779px] top-[5.33px] w-[15.3px]" data-name="PinIcn">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.2996 16.3388">
        <g id="PinIcn">
          <path d={svgPaths.p35fb1800} fill="var(--fill-0, #8D8D8D)" id="OFF" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[22px] left-0 overflow-clip right-0 top-0">
      <div className="-translate-y-1/2 absolute left-[7px] size-[14px] top-1/2" data-name="Close Btn">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <circle cx="7" cy="7" fill="var(--fill-0, #424242)" id="Close Btn" r="6.75" stroke="var(--stroke-0, #141414)" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['SF_Compact_Display:Regular',sans-serif] justify-center leading-[0] left-[calc(50%-0.5px)] not-italic text-[14px] text-center text-white top-[calc(50%-0.5px)] whitespace-nowrap">
        <p className="leading-[normal]">{`VST: ReaEQ (Cockos) - Track  1 [4/4]`}</p>
      </div>
      <PinIcn />
    </div>
  );
}

function Group() {
  return (
    <div className="-translate-y-1/2 absolute h-[10px] right-[6px] top-1/2 w-[7px]">
      <div className="absolute inset-[-7.07%_-5.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.70711 11.4142">
          <g id="Group 4" opacity="0.4">
            <path d={svgPaths.p93c7400} id="Vector 2" stroke="var(--stroke-0, white)" />
            <path d={svgPaths.p3cfd9440} id="Vector 2_2" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function DropdownSmall() {
  return (
    <div className="bg-[#303030] h-[24px] overflow-clip relative rounded-[3px] shrink-0 w-[246px]" data-name="Dropdown/Small">
      <Group />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[8px] not-italic text-[14px] text-white top-[calc(50%-0.5px)] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">No preset</p>
      </div>
    </div>
  );
}

function Plus() {
  return (
    <div className="h-[16px] relative shrink-0 w-[12px]" data-name="Plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 16">
        <g id="Plus">
          <path d="M6 3V13M1 8H11" id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[4px] h-[18px] items-center overflow-clip relative shrink-0">
      <Plus />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">New</p>
      </div>
    </div>
  );
}

function ButtonSmall() {
  return (
    <div className="bg-[#303030] content-stretch flex flex-col items-center overflow-clip px-[8px] py-[3px] relative rounded-[3px] shrink-0" data-name="Button/Small">
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[4px] h-[18px] items-center overflow-clip relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Parameter</p>
      </div>
    </div>
  );
}

function ButtonSmall1() {
  return (
    <div className="bg-[#303030] content-stretch flex flex-col items-center overflow-clip px-[8px] py-[3px] relative rounded-[3px] shrink-0" data-name="Button/Small">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[4px] h-[18px] items-center overflow-clip relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">2 in 2 out</p>
      </div>
    </div>
  );
}

function ButtonSmall2() {
  return (
    <div className="bg-[#303030] content-stretch flex flex-col items-center overflow-clip px-[8px] py-[3px] relative rounded-[3px] shrink-0" data-name="Button/Small">
      <Frame3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[16px] overflow-clip top-[35px]">
      <DropdownSmall />
      <ButtonSmall />
      <ButtonSmall1 />
      <ButtonSmall2 />
    </div>
  );
}

function KnobTiny() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="Knob/Tiny">
      <div className="absolute inset-[-19.02%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.653 38.653">
          <g id="Knob/Tiny">
            <circle cx="19.3265" cy="19.3265" id="Border" r="12.5" stroke="var(--stroke-0, black)" strokeOpacity="0.2" />
            <g id="Ellipse 1">
              <circle cx="19.3265" cy="19.3265" fill="var(--fill-0, #303030)" r="12" />
              <circle cx="19.3265" cy="19.3265" fill="url(#paint0_linear_1_2351)" r="12" />
            </g>
            <path d={svgPaths.p230d9b10} fill="var(--fill-0, #00A985)" id="Progress" />
            <g id="Arrow/83">
              <path d={svgPaths.p32848100} fill="var(--fill-0, #00A985)" id="Polygon 1" />
            </g>
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_2351" x1="19.3265" x2="19.3265" y1="7.32653" y2="31.3265">
              <stop stopColor="white" stopOpacity="0.15" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#00a985] h-[24px] overflow-clip relative rounded-[3px] shrink-0 w-[56px]">
      <div className="-translate-y-1/2 absolute h-[12px] left-[11px] top-1/2 w-[11px]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-6.82%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5 13.5">
            <path d={svgPaths.p318c76d8} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic right-[19px] text-[14px] text-black text-center top-[calc(50%+0.5px)] tracking-[0.14px] translate-x-1/2 whitespace-nowrap">
        <p className="leading-[normal]">ON</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center overflow-clip right-[16px] top-[33px]">
      <KnobTiny />
      <Frame4 />
    </div>
  );
}

function HeaderBig() {
  return (
    <div className="bg-[#1e1e1e] h-[75px] overflow-clip relative shrink-0 w-[802px]" data-name="Header/Big">
      <Frame />
      <Frame5 />
      <Frame6 />
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-0.5px_0px_0px_black]" />
    </div>
  );
}

function NumbersLeft() {
  return (
    <div className="absolute contents font-['Inter:Medium',sans-serif] font-medium leading-[0] left-[4px] not-italic text-[12px] text-white top-[33px] tracking-[0.12px] whitespace-nowrap" data-name="Numbers/Left">
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[4px] opacity-40 top-[188.5px]">
        <p className="leading-[normal]">+6</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[4px] opacity-40 top-[114.5px]">
        <p className="leading-[normal]">+12</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[4px] opacity-40 top-[40.5px]">
        <p className="leading-[normal]">+18</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[4px] opacity-40 top-[262.5px]">
        <p className="leading-[normal]">+0</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[4px] opacity-40 top-[336.5px]">
        <p className="leading-[normal]">-6</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[4px] opacity-40 top-[411.5px]">
        <p className="leading-[normal]">-12</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col justify-center left-[4px] opacity-40 top-[485.5px]">
        <p className="leading-[normal]">-18</p>
      </div>
    </div>
  );
}

function NumbersRight() {
  return (
    <div className="absolute contents font-['Inter:Medium',sans-serif] font-medium leading-[0] left-[700px] not-italic text-[12px] text-right text-white top-[33px] tracking-[0.12px] whitespace-nowrap" data-name="Numbers/Right">
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[729px] opacity-40 top-[187.5px]">
        <p className="leading-[normal]">-30</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[729px] opacity-40 top-[114.5px]">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[729px] opacity-40 top-[40.5px]">
        <p className="leading-[normal]">+30</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[729px] opacity-40 top-[263.5px]">
        <p className="leading-[normal]">-60</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[729px] opacity-40 top-[339.5px]">
        <p className="leading-[normal]">-90</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[730px] opacity-40 top-[411.5px]">
        <p className="leading-[normal]">-120</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col justify-center left-[727px] opacity-40 top-[485.5px]">
        <p className="leading-[normal]">-150</p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute h-[202.928px] left-[-1px] top-[182.05px] w-[734.867px]">
      <div className="absolute inset-[-0.25%_0_-0.59%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 735.867 204.622">
          <g id="Group 6">
            <path d={svgPaths.p15e3b680} fill="var(--fill-0, #E74D3D)" fillOpacity="0.3" id="Vector 3" stroke="var(--stroke-0, #E74D3D)" />
            <path d={svgPaths.p24558c00} fill="var(--fill-0, #9A59B5)" fillOpacity="0.8" id="Union" stroke="var(--stroke-0, #9A59B5)" />
            <path d={svgPaths.p26c2f080} fill="var(--fill-0, #3598DB)" fillOpacity="0.3" id="Union_2" stroke="var(--stroke-0, #3598DB)" />
            <path d={svgPaths.p13b51100} fill="var(--fill-0, #1BBC9C)" fillOpacity="0.3" id="Vector 3_2" stroke="var(--stroke-0, #1BBC9C)" />
            <line id="Line 1" stroke="url(#paint0_linear_1_2099)" x1="1.5" x2="735.367" y1="90.2122" y2="90.2122" />
            <path d={svgPaths.p32721100} id="Vector 5" stroke="var(--stroke-0, white)" strokeLinecap="square" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_2099" x1="1.5" x2="735.367" y1="91.7046" y2="91.7046">
              <stop offset="0.0556181" stopColor="#DB5119" />
              <stop offset="0.322657" stopColor="#9A59B5" />
              <stop offset="0.546011" stopColor="#3598DB" />
              <stop offset="0.953968" stopColor="#1BBC9C" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function EqDot() {
  return (
    <div className="absolute left-[34px] overflow-clip rounded-[20px] size-[21px] top-[303px]" data-name="EQ Dot">
      <div className="absolute inset-[14.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #E74D3D)" id="Ellipse 2" r="7.5" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Compact_Display:Semibold',sans-serif] inset-[3px] justify-center leading-[0] not-italic text-[11px] text-black text-center">
        <p className="leading-[normal] whitespace-pre-wrap">1</p>
      </div>
    </div>
  );
}

function EqDot1() {
  return (
    <div className="absolute bg-white left-[224px] overflow-clip rounded-[20px] size-[21px] top-[330px]" data-name="EQ Dot">
      <div className="absolute inset-[14.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #9A59B5)" id="Ellipse 2" r="7.5" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Compact_Display:Semibold',sans-serif] inset-[3px] justify-center leading-[0] not-italic text-[11px] text-center text-white">
        <p className="leading-[normal] whitespace-pre-wrap">2</p>
      </div>
    </div>
  );
}

function EqDot2() {
  return (
    <div className="absolute left-[390.23px] overflow-clip rounded-[20px] size-[21px] top-[170.8px]" data-name="EQ Dot">
      <div className="absolute inset-[14.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #3598DB)" id="Ellipse 2" r="7.5" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Compact_Display:Semibold',sans-serif] inset-[3px] justify-center leading-[0] not-italic text-[11px] text-black text-center">
        <p className="leading-[normal] whitespace-pre-wrap">3</p>
      </div>
    </div>
  );
}

function EqDot3() {
  return (
    <div className="absolute left-[690px] overflow-clip rounded-[20px] size-[21px] top-[339px]" data-name="EQ Dot">
      <div className="absolute inset-[14.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #1BBC9C)" id="Ellipse 2" r="7.5" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['SF_Compact_Display:Semibold',sans-serif] inset-[3px] justify-center leading-[0] not-italic text-[11px] text-black text-center">
        <p className="leading-[normal] whitespace-pre-wrap">4</p>
      </div>
    </div>
  );
}

function EqGraph() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#1e1e1e] h-[544px] left-1/2 overflow-clip top-[calc(50%+1px)] w-[733px]" data-name="EQ Graph">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[541px] left-1/2 top-[calc(50%-1.5px)] w-[735px]" data-name="image 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[101.73%] left-[-0.79%] max-w-none top-[-0.96%] w-[101.71%]" src={imgImage1} />
        </div>
      </div>
      <div className="absolute inset-[0_0_-5.88%_-0.14%]" data-name="Grid">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 734 576">
          <path d={svgPaths.p915b80} id="Grid" opacity="0.2" stroke="var(--stroke-0, white)" strokeWidth="0.5" />
        </svg>
      </div>
      <NumbersLeft />
      <NumbersRight />
      <Group2 />
      <EqDot />
      <EqDot1 />
      <EqDot2 />
      <EqDot3 />
    </div>
  );
}

function NumbersBottom() {
  return (
    <div className="-translate-x-1/2 absolute bottom-0 h-[14px] left-[calc(50%+1.5px)] overflow-clip w-[678px]" data-name="Numbers/Bottom">
      <div className="absolute bg-[#1e1e1e] h-[14px] left-[188px] top-0 w-[50px]" />
      <div className="absolute bg-[#1e1e1e] h-[14px] left-[244px] top-0 w-[73px]" />
      <div className="absolute bg-[#1e1e1e] h-[14px] left-[457px] top-0 w-[54px]" />
      <div className="absolute bg-[#1e1e1e] h-[14px] left-[516px] top-0 w-[77px]" />
      <div className="absolute bg-[#1e1e1e] h-[14px] left-[601px] top-0 w-[77px]" />
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[16px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">50</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[70px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">100</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[136px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">200</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[179px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">300</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[236px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">500</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[315px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">1.0k</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[398px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">2.0k</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[447px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">3.0k</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[508px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">5.0k</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[593px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">10.0k</p>
      </div>
      <div className="-translate-x-full -translate-y-1/2 absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-[678px] not-italic opacity-40 text-[12px] text-right text-white top-[7px] tracking-[0.12px] whitespace-nowrap">
        <p className="leading-[normal]">20.0k</p>
      </div>
    </div>
  );
}

function Graph() {
  return (
    <div className="h-[344px] relative shrink-0 w-full" data-name="Graph">
      <EqGraph />
      <NumbersBottom />
    </div>
  );
}

function Tab() {
  return (
    <div className="bg-[#424242] h-[23px] overflow-clip relative shrink-0 w-[42px]" data-name="Tab">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[14px] text-center text-white top-1/2 tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Tab1() {
  return (
    <div className="bg-[#9a59b5] h-[23px] overflow-clip relative shrink-0 w-[42px]" data-name="Tab">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[14px] text-center text-white top-1/2 tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Tab2() {
  return (
    <div className="bg-[#424242] h-[23px] overflow-clip relative shrink-0 w-[42px]" data-name="Tab">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[14px] text-center text-white top-1/2 tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Tab3() {
  return (
    <div className="bg-[#424242] h-[23px] overflow-clip relative shrink-0 w-[42px]" data-name="Tab">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[14px] text-center text-white top-1/2 tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex items-center left-[297px] overflow-clip top-0">
      <Tab />
      <div className="bg-[#262626] h-[23px] shrink-0 w-px" />
      <Tab1 />
      <div className="bg-[#262626] h-[23px] shrink-0 w-px" />
      <Tab2 />
      <div className="bg-[#262626] h-[23px] shrink-0 w-px" />
      <Tab3 />
    </div>
  );
}

function Arrow() {
  return (
    <div className="relative size-[30px]" data-name="Arrow">
      <div className="absolute inset-[0_0_-20.39%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 36.1156">
          <g id="Arrow">
            <path d={svgPaths.p38a6c280} fill="var(--fill-0, #9A59B5)" id="Polygon 1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ProgressMed() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Progress/Med/38">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[72px] top-1/2" data-name="Progress">
        <div className="absolute inset-[1.32%_60.15%_6.7%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.69 66.2258">
            <path d={svgPaths.p1df90c80} fill="var(--fill-0, #9A59B5)" id="Progress" />
          </svg>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[16.53px] size-[38.945px] top-[16.53px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
        <div className="flex-none rotate-[-158.37deg]">
          <Arrow />
        </div>
      </div>
    </div>
  );
}

function KnobMed() {
  return (
    <div className="relative shrink-0 size-[72px]" data-name="Knob/Med">
      <div className="absolute inset-[6.94%]" data-name="Border">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
            <circle cx="32" cy="32" id="Border" r="31.5" stroke="var(--stroke-0, black)" strokeOpacity="0.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[6.94%]" data-name="Body">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62 62">
          <g id="Body">
            <circle cx="31" cy="31" fill="var(--fill-0, #303030)" r="31" />
            <circle cx="31" cy="31" fill="url(#paint0_linear_1_1732)" r="31" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1732" x1="31" x2="31" y1="0" y2="62">
              <stop stopColor="white" stopOpacity="0.15" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <ProgressMed />
    </div>
  );
}

function Frame10() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[8px] items-center left-1/2 overflow-clip top-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Freq</p>
      </div>
      <KnobMed />
    </div>
  );
}

function InputKnob() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center left-1/2 overflow-clip px-[6px] py-[3px] rounded-[3px] top-[100px]" data-name="Input/Knob">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9a59b5] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">487.7 Hz</p>
      </div>
    </div>
  );
}

function RoundControllerMed() {
  return (
    <div className="h-[123px] overflow-clip relative shrink-0 w-[90px]" data-name="RoundController/Med">
      <Frame10 />
      <InputKnob />
    </div>
  );
}

function Arrow1() {
  return (
    <div className="relative size-[30px]" data-name="Arrow">
      <div className="absolute inset-[0_0_-20.39%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 36.1156">
          <g id="Arrow">
            <path d={svgPaths.p38a6c280} fill="var(--fill-0, #9A59B5)" id="Polygon 1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ProgressMed2() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Progress/Med/55">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[72px] top-1/2" data-name="Progress">
        <div className="absolute inset-[0_12.84%_6.7%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62.7532 67.1769">
            <path d={svgPaths.p2096ac00} fill="var(--fill-0, #9A59B5)" id="Progress" />
          </svg>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[19.64px] size-[32.725px] top-[19.64px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
        <div className="flex-none rotate-[-95.47deg]">
          <Arrow1 />
        </div>
      </div>
    </div>
  );
}

function KnobMed1() {
  return (
    <div className="relative shrink-0 size-[72px]" data-name="Knob/Med">
      <div className="absolute inset-[6.94%]" data-name="Border">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
            <circle cx="32" cy="32" id="Border" r="31.5" stroke="var(--stroke-0, black)" strokeOpacity="0.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[6.94%]" data-name="Body">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62 62">
          <g id="Body">
            <circle cx="31" cy="31" fill="var(--fill-0, #303030)" r="31" />
            <circle cx="31" cy="31" fill="url(#paint0_linear_1_1610)" r="31" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1610" x1="31" x2="31" y1="0" y2="62">
              <stop stopColor="white" stopOpacity="0.15" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <ProgressMed2 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[8px] items-center left-1/2 overflow-clip top-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Gain</p>
      </div>
      <KnobMed1 />
    </div>
  );
}

function InputKnob1() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center left-1/2 overflow-clip px-[6px] py-[3px] rounded-[3px] top-[100px]" data-name="Input/Knob">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9a59b5] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p>
          <span className="leading-[normal]">{`-5.1 dB `}</span>
          <span className="leading-[normal] text-white">(B4)</span>
        </p>
      </div>
    </div>
  );
}

function RoundControllerMed1() {
  return (
    <div className="h-[123px] overflow-clip relative shrink-0 w-[90px]" data-name="RoundController/Med">
      <Frame11 />
      <InputKnob1 />
    </div>
  );
}

function Arrow2() {
  return (
    <div className="relative size-[30px]" data-name="Arrow">
      <div className="absolute inset-[0_0_-20.39%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 36.1156">
          <g id="Arrow">
            <path d={svgPaths.p38a6c280} fill="var(--fill-0, #9A59B5)" id="Polygon 1" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ProgressMed1() {
  return (
    <div className="absolute inset-0 overflow-clip" data-name="Progress/Med/42">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[72px] top-1/2" data-name="Progress">
        <div className="absolute inset-[0_48.95%_6.7%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.7539 67.1769">
            <path d={svgPaths.p370555f0} fill="var(--fill-0, #9A59B5)" id="Progress" />
          </svg>
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[15.18px] size-[41.648px] top-[15.18px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "154" } as React.CSSProperties}>
        <div className="flex-none rotate-[-145.99deg]">
          <Arrow2 />
        </div>
      </div>
    </div>
  );
}

function KnobMed2() {
  return (
    <div className="relative shrink-0 size-[72px]" data-name="Knob/Med">
      <div className="absolute inset-[6.94%]" data-name="Border">
        <div className="absolute inset-[-1.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
            <circle cx="32" cy="32" id="Border" r="31.5" stroke="var(--stroke-0, black)" strokeOpacity="0.2" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[6.94%]" data-name="Body">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62 62">
          <g id="Body">
            <circle cx="31" cy="31" fill="var(--fill-0, #303030)" r="31" />
            <circle cx="31" cy="31" fill="url(#paint0_linear_1_1732)" r="31" />
          </g>
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1732" x1="31" x2="31" y1="0" y2="62">
              <stop stopColor="white" stopOpacity="0.15" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <ProgressMed1 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col gap-[8px] items-center left-1/2 overflow-clip top-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Q</p>
      </div>
      <KnobMed2 />
    </div>
  );
}

function InputKnob2() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center left-1/2 overflow-clip px-[6px] py-[3px] rounded-[3px] top-[100px]" data-name="Input/Knob">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9a59b5] text-[14px] text-center tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">2.0</p>
      </div>
    </div>
  );
}

function RoundControllerMed2() {
  return (
    <div className="h-[123px] overflow-clip relative shrink-0 w-[90px]" data-name="RoundController/Med">
      <Frame12 />
      <InputKnob2 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[16px] items-start left-[calc(50%+16.5px)] overflow-clip top-[calc(50%+12px)]">
      <RoundControllerMed />
      <RoundControllerMed1 />
      <RoundControllerMed2 />
    </div>
  );
}

function Group1() {
  return (
    <div className="-translate-y-1/2 absolute h-[10px] right-[8px] top-1/2 w-[7px]">
      <div className="absolute inset-[-7.07%_-5.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.70711 11.4142">
          <g id="Group 4" opacity="0.4">
            <path d={svgPaths.p93c7400} id="Vector 2" stroke="var(--stroke-0, white)" />
            <path d={svgPaths.p3cfd9440} id="Vector 2_2" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[12px] relative shrink-0 w-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 12">
        <g clipPath="url(#clip0_1_2725)" id="Frame 14">
          <path d={svgPaths.p13e2db00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_2725">
            <rect fill="white" height="12" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="-translate-y-1/2 absolute content-stretch flex gap-[8px] items-center left-[10px] overflow-clip top-[calc(50%-0.5px)]">
      <Frame7 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white tracking-[0.48px] whitespace-nowrap">
        <p className="leading-[normal]">Band</p>
      </div>
    </div>
  );
}

function DropdownMedium() {
  return (
    <div className="-translate-y-1/2 absolute bg-[#424242] h-[32px] left-[26px] overflow-clip rounded-[5px] top-[calc(50%+7px)] w-[142px]" data-name="Dropdown/Medium">
      <Group1 />
      <Frame8 />
    </div>
  );
}

function Details() {
  return (
    <div className="bg-[#303030] h-[178px] relative shrink-0 w-[733px]" data-name="Details">
      <Frame14 />
      <Frame15 />
      <DropdownMedium />
      <div className="absolute h-[19.286px] left-[691px] top-[22px] w-[18px]" data-name="Vector">
        <div className="absolute inset-[-5.19%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 21.2857">
            <path d={svgPaths.p2cc84d20} id="Vector" stroke="var(--stroke-0, #9A59B5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute right-[24px] size-[18px] top-[82px]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d="M10 1V19M1 10H19" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[23px] right-[26px] size-[14px]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path d={svgPaths.p3990b980} id="Vector" stroke="var(--stroke-0, #8D8D8D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CheckboxOn() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Checkbox/ON">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Checkbox/ON">
          <rect fill="var(--fill-0, #00A985)" height="14" rx="3" width="14" />
          <rect height="13.5" rx="2.75" stroke="var(--stroke-0, black)" strokeOpacity="0.1" strokeWidth="0.5" width="13.5" x="0.25" y="0.25" />
          <path d="M3 7.57143L6.2 11L11 3" id="Vector 6" stroke="var(--stroke-0, #141414)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function CheckboxItem() {
  return (
    <div className="content-stretch flex gap-[6px] h-[17px] items-center overflow-clip relative shrink-0" data-name="CheckboxItem">
      <CheckboxOn />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Log-scale automated freq.</p>
      </div>
    </div>
  );
}

function CheckboxOn1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Checkbox/ON">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Checkbox/ON">
          <rect fill="var(--fill-0, #00A985)" height="14" rx="3" width="14" />
          <rect height="13.5" rx="2.75" stroke="var(--stroke-0, black)" strokeOpacity="0.1" strokeWidth="0.5" width="13.5" x="0.25" y="0.25" />
          <path d="M3 7.57143L6.2 11L11 3" id="Vector 6" stroke="var(--stroke-0, #141414)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function CheckboxItem1() {
  return (
    <div className="content-stretch flex gap-[6px] h-[17px] items-center overflow-clip relative shrink-0" data-name="CheckboxItem">
      <CheckboxOn1 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Show grid</p>
      </div>
    </div>
  );
}

function CheckboxOff() {
  return (
    <div className="bg-[#1e1e1e] relative rounded-[3px] shrink-0 size-[14px]" data-name="Checkbox/OFF">
      <div aria-hidden="true" className="absolute border-[#8d8d8d] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function CheckboxItem2() {
  return (
    <div className="content-stretch flex gap-[6px] h-[17px] items-center overflow-clip relative shrink-0" data-name="CheckboxItem">
      <CheckboxOff />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Show phase</p>
      </div>
    </div>
  );
}

function CheckboxOff1() {
  return (
    <div className="bg-[#1e1e1e] relative rounded-[3px] shrink-0 size-[14px]" data-name="Checkbox/OFF">
      <div aria-hidden="true" className="absolute border-[#8d8d8d] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[3px]" />
    </div>
  );
}

function CheckboxItem3() {
  return (
    <div className="content-stretch flex gap-[6px] h-[17px] items-center overflow-clip relative shrink-0" data-name="CheckboxItem">
      <CheckboxOff1 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">Compact mode</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[32px] items-center left-1/2 overflow-clip top-[calc(50%+0.5px)]">
      <CheckboxItem />
      <CheckboxItem1 />
      <CheckboxItem2 />
      <CheckboxItem3 />
    </div>
  );
}

function Options() {
  return (
    <div className="bg-[#1e1e1e] h-[50px] relative shrink-0 w-[733px]" data-name="Options">
      <Frame17 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <Details />
      <Options />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-[733px]">
      <Graph />
      <Frame16 />
    </div>
  );
}

function EqDot4() {
  return <div className="absolute left-[21px] overflow-clip rounded-[20px] size-[21px] top-[141px]" data-name="EQ Dot" />;
}

function Handler() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#141414] border border-[#00a985] border-solid h-[12px] left-1/2 overflow-clip rounded-[2px] top-0 w-[22px]" data-name="Handler">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#00a985] h-[2px] left-1/2 rounded-[1px] top-1/2 w-[12px]" />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute inset-[27.95%_0_0_0] overflow-clip" data-name="0">
      <div className="absolute bg-[#00a985] inset-[6.62px_8px_0.22px_8px] rounded-[2px]" data-name="Fg" />
      <Handler />
    </div>
  );
}

function DefaultMark() {
  return (
    <div className="-translate-x-1/2 absolute contents left-[calc(50%+8px)] top-[49px]" data-name="DefaultMark">
      <div className="-translate-x-1/2 absolute left-[calc(50%+8px)] size-[6px] top-[49px]" data-name="Fixed">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
          <circle cx="3" cy="3" fill="var(--fill-0, #141414)" id="Fixed" r="3" />
        </svg>
      </div>
    </div>
  );
}

function SliderVertical() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[31px] left-1/2 top-[25px] w-[22px]" data-name="Slider/Vertical">
      <div className="absolute bg-[#141414] inset-[0_10px] rounded-[2px]" data-name="Bg" />
      <Component />
      <DefaultMark />
    </div>
  );
}

function InputKnob3() {
  return (
    <div className="absolute bottom-0 content-stretch flex items-center left-[3px] overflow-clip px-[6px] py-[3px] right-[3px] rounded-[3px]" data-name="Input/Knob">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[normal]">-7.3</p>
      </div>
    </div>
  );
}

function VerticalControllerDefault() {
  return (
    <div className="-translate-x-1/2 absolute bottom-[24px] left-[calc(50%+0.5px)] overflow-clip top-[24px] w-[44px]" data-name="VerticalController/Default">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-0 not-italic right-0 text-[#8d8d8d] text-[14px] text-center top-[8.5px] tracking-[0.14px]">
        <p className="leading-[normal] whitespace-pre-wrap">Gain</p>
      </div>
      <SliderVertical />
      <InputKnob3 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-[#262626] overflow-clip relative self-stretch shrink-0 w-[67px]">
      <EqDot4 />
      <VerticalControllerDefault />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative shrink-0" data-name="Content">
      <Frame13 />
      <Frame9 />
    </div>
  );
}

export default function ReaEqExpanded() {
  return (
    <div className="relative rounded-[6px] size-full" data-name="ReaEQ:Expanded">
      <div className="content-stretch flex flex-col items-center overflow-clip relative rounded-[inherit] size-full">
        <HeaderBig />
        <Content />
      </div>
      <div aria-hidden="true" className="absolute border border-[#4c4c4c] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_16px_40px_0px_rgba(0,0,0,0.5)]" />
    </div>
  );
}