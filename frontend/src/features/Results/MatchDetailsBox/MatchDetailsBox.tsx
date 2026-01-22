import MatchDetailsCard from "./MatchDetailsCard";

interface Props {
  impostorName: string;
  word: string;
}

const MatchDetailsBox = ({ impostorName, word }: Props) => {
  return (
    <div>
      <MatchDetailsCard
        text="THE IMPOSTOR WAS"
        blockText={impostorName}
      ></MatchDetailsCard>

      <MatchDetailsCard text="THE WORD WAS" blockText={word}></MatchDetailsCard>
    </div>
  );
};

export default MatchDetailsBox;
