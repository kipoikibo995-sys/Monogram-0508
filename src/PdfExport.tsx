import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Rect, Line, Circle, Image as PdfImage, Font, G } from '@react-pdf/renderer';
import { Project } from './db';
import { ImageSettings } from './types';

const getStyles = (sf: number) => StyleSheet.create({
  page: { backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  centerPage: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 * sf, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica', height: '100%' },
  paddedPage: { padding: 50 * sf, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica', height: '100%' },
  coverTitle: { fontSize: 72 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 10 * sf, letterSpacing: -1 },
  coverTheme: { fontSize: 36 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 20 * sf, letterSpacing: 2 },
  coverAuthor: { fontSize: 24 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  topSubtitle: { fontSize: 18 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, letterSpacing: 1 },
  subtitle2: { fontSize: 36 * sf, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', marginBottom: 32 * sf, letterSpacing: -1 },
  h1: { fontSize: 28 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 20 * sf, textAlign: 'center' },
  h2: { fontSize: 18 * sf, fontFamily: 'Helvetica-BoldOblique', marginBottom: 10 * sf, marginTop: 20 * sf },
  bodyText: { fontSize: 14 * sf, fontFamily: 'Helvetica', marginBottom: 15 * sf, lineHeight: 1.5 },
  copyrightText: { fontSize: 12 * sf, fontFamily: 'Helvetica', marginBottom: 10 * sf, textAlign: 'center', color: '#333333' },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 * sf },
});

export type ProcessedImage = {
  gridCols: number;
  gridRows: number;
  cells: { x: number; y: number; shapeIndex: number; code: string }[];
  settings: ImageSettings;
};

interface PdfExportProps {
  project: Project;
  processedImages: ProcessedImage[];
  isExportingSolutions: boolean;
  userTier?: 'free' | 'pro' | 'enterprise';
}


const SHAPES = [
  { name: 'Empty', code: '', index: 0 },
  { name: 'Dot', code: '.', index: 1 },
  { name: 'Slash', code: '1', index: 2 },
  { name: 'Backslash', code: '2', index: 3 },
  { name: 'Cross', code: '3', index: 4 },
  { name: 'Asterisk', code: '4', index: 5 },
  { name: 'Filled Square', code: '5', index: 6 },
];

const getColumnLetter = (col: number): string => {
  let temp, letter = '';
  while (col >= 0) {
    temp = col % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp) / 26 - 1;
  }
  return letter;
};


export const PdfDocument = ({ project, processedImages, isExportingSolutions, userTier = 'free' }: PdfExportProps) => {
  const trimSize = processedImages[0]?.settings?.trimSize || '8.5x11';
  const PAGE_SIZE = trimSize === '8.5x11' ? [612, 792] : trimSize === '6x9' ? [432, 648] : [612, 612];
  const sf = PAGE_SIZE[0] / 850;
  const styles = getStyles(sf);

  const safeMargin = 36;
  const gutter = processedImages[0]?.settings?.gutterMargin || 0;
  const pagePadding = Math.max(50, safeMargin + gutter + 10); // add 10pt buffer


  const getParsed = (key: string, def: any) => {
    try {
      const val = (project.bookFlowData as any)?.[key];
      if (val) return { ...def, ...JSON.parse(val) };
    } catch(e) {}
    return def;
  };

  const cover = getParsed('coverBook', {
    topSubtitle: 'ONE COLOR COLORING BOOK',
    subtitle2: 'Color by Number',
    mainTitle: 'MONOCHROME',
    themeTitle: 'SPOOKY MYSTERIES',
    author: 'ALAN PARKER',
    templateImage: ''
  });

  const copyright = getParsed('copyrightPage', {
    title: 'COPYRIGHT PAGE',
    year: '2026',
    author: 'Alan Parker',
    rights: 'All Rights Reserved.',
    description: 'No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission from the author.',
    isbn: '9798188106522',
    imprint: 'Independently published'
  });

  const welcome = getParsed('welcomePage', {
    title: 'WELCOME TO MONOCHROME COLOR QUEST',
    intro: 'Discover the relaxing joy of revealing beautiful monochrome artwork—\none mark at a time.\nInside this book you\'ll uncover 101 hidden illustrations, including\nmajestic wildlife, adorable pets, colorful birds and more',
    howToTitle: 'HOW TO USE THIS BOOK',
    howToSteps: 'Each square contains a number.\n\nMatch the number with the symbol\nshown in the legend below the\npuzzle.\n\nUsing a black pen, fill every square\nwith the correct symbol.',
    penTitle: 'PEN RECOMMENDATIONS',
    penIntro: 'For the best results, we\nrecommend:',
    penList: ['Fine liner (0.4–0.6 mm)', 'Black gel pen', 'Black ballpoint pen'],
    penOutro: 'Avoid permanent markers or\nalcohol-based markers, as they\nmay bleed through the paper.\n\nIf you\'re using a very wet pen,\nplace a blank sheet behind the\npage to protect the next puzzle.',
    legend: [
      { num: '0', title: 'DOT', desc: 'Center Dot only', symbol: '•' },
      { num: '1', title: 'SLASH', desc: 'Single slash (/)', symbol: '/' },
      { num: '2', title: 'BACKSLASH', desc: 'Single backslash (\\)', symbol: '\\' },
      { num: '3', title: 'X', desc: 'Cross mark (X)', symbol: '✕' },
      { num: '4', title: 'ASTERISK', desc: 'Asterisk (*)', symbol: '✱' },
      { num: '5', title: 'FILLED SQUARE', desc: 'Solid black square', symbol: '■' }
    ],
    illustrationImage: ''
  });

  const mystery = getParsed('mystery', {
    title: 'Mystery #01',
    marks: [
      { mark: '•', code: '.', name: 'Dot', density: '75.4%' },
      { mark: '/', code: '1', name: 'Slash', density: '6.7%' },
      { mark: '\\', code: '2', name: 'Backslash', density: '2.3%' },
      { mark: '✕', code: '3', name: 'Cross', density: '1.3%' },
      { mark: '✱', code: '4', name: 'Asterisk', density: '8.5%' },
      { mark: '■', code: '5', name: 'Filled Square', density: '5.9%' }
    ]
  });

  const warmup = getParsed('warmUpPractice', {
    title: 'WARM UP PRACTICE',
    subtitle: 'Hone your pen strokes by practicing each code in the cells below\nbefore starting the puzzle.',
    levels: [
        { label: 'LEVEL 0: DOT', desc: 'Practice drawing "Center Dot only" in these cells:', hint: '•' },
        { label: 'LEVEL 1: SLASH', desc: 'Practice drawing "Single slash (/)" in these cells:', hint: '1' },
        { label: 'LEVEL 2: BACKSLASH', desc: 'Practice drawing "Single backslash (\\)" in these cells:', hint: '2' },
        { label: 'LEVEL 3: X', desc: 'Practice drawing "Cross mark (X)" in these cells:', hint: '3' },
        { label: 'LEVEL 4: ASTERISK', desc: 'Practice drawing "Asterisk(*)" in these cells:', hint: '4' },
        { label: 'LEVEL 5: FILLED SQUARE', desc: 'Practice drawing "Solid black square" in these cells:', hint: '5' }
    ]
  });

  const pentesting = getParsed('penTestingLab', {
    title: 'PEN TESTING LAB',
    subtitle: 'Try out your fine-liners, black gel, or black ballpoint pen below.\nCompare ink bleed-through and opacity.',
    pens: ['PEN #1:', 'PEN #2:', 'PEN #3:', 'PEN #4:'],
    gridsTitle: 'MINI PRACTICE GRIDS'
  });

  const thankyou = getParsed('thankyou', {
    title: 'Thank You for Coloring With Us',
    heading1: 'You Revealed the Mystery — Well Done!',
    body1: 'You made it through every hidden creature, every shadowy secret, every spooky surprise.\nThat takes patience, focus, and a seriously steady hand.',
    heading2: 'Did something make you smile? Surprise you? Creep you out (in the best way)?',
    body2: 'An honest review on Amazon, even just one sentence — helps other puzzle lovers find this book and keeps this series growing.\nSearch "101 Spooky Monochrome Color By Number Mysteries Alan Parker" on Amazon to leave your review.\nIt takes 60 seconds and means everything to an independent creator. Thank you.',
    heading3: 'Love One-Pen Puzzles? Explore the Full Series:',
    body3: 'Search "Monochrome Color by Number Alan Parker" on Amazon to find all volumes.'
  });

  return (
    <Document>
      {!isExportingSolutions && (
        <>
          <Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, justifyContent: 'space-between', paddingVertical: 80 * sf , paddingHorizontal: pagePadding * sf }}>
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={styles.topSubtitle}>{cover.topSubtitle}</Text>
              <Text style={styles.subtitle2}>{cover.subtitle2}</Text>
              <Text style={styles.coverTitle}>{cover.mainTitle}</Text>
              <Text style={styles.coverTheme}>{cover.themeTitle}</Text>
            </View>
            {cover.templateImage && (
               <View style={{ flexGrow: 1, width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
                 <PdfImage src={cover.templateImage} style={{ width: '90%', height: 450 * sf * sf, objectFit: 'contain' }} />
               </View>
            )}
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={styles.coverAuthor}>{cover.author}</Text>
            </View>
          </Page>

                    <Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, justifyContent: 'flex-start', paddingTop: 70 * sf , paddingHorizontal: pagePadding * sf }}>
            <Text style={{ fontSize: 30 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 64 * sf, textTransform: 'uppercase' }}>{copyright.title}</Text>
            
            <View style={{ width: '80%', alignSelf: 'center', flexDirection: 'column' }}>
              <View style={{ marginBottom: 32 * sf }}>
                <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 5 * sf }}>Copyright © {copyright.year} {copyright.author}</Text>
                <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold' }}>{copyright.rights}</Text>
              </View>
              
              <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica', lineHeight: 1.6, marginBottom: 32 * sf }}>{copyright.description}</Text>
              
              <View>
                <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 5 * sf }}>ISBN: <Text style={{ fontFamily: 'Helvetica' }}>{copyright.isbn}</Text></Text>
                <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold' }}>Imprint: <Text style={{ fontFamily: 'Helvetica' }}>{copyright.imprint}</Text></Text>
              </View>
            </View>
          </Page>

                    <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 30 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{welcome.title}</Text>
            <Text style={{ fontSize: 18 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30 * sf, lineHeight: 1.4 }}>{welcome.intro}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
              {/* Left Column */}
              <View style={{ width: '45%', flexDirection: 'column' }}>
                <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 10 * sf, textTransform: 'uppercase' }}>{welcome.howToTitle}</Text>
                <Text style={{ fontSize: 18 * sf, fontFamily: 'Helvetica', marginBottom: 20 * sf, lineHeight: 1.4 }}>{welcome.howToSteps}</Text>
                
                <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 5 * sf, textTransform: 'uppercase' }}>{welcome.penTitle}</Text>
                <Text style={{ fontSize: 18 * sf, fontFamily: 'Helvetica', marginBottom: 10 * sf, lineHeight: 1.4 }}>{welcome.penIntro}</Text>
                
                <View style={{ marginBottom: 15 * sf }}>
                  {welcome.penList?.map((item: string, idx: number) => (
                    <View key={idx} style={{ flexDirection: 'row', marginBottom: 5 * sf }}>
                      <Text style={{ fontSize: 18 * sf, fontFamily: 'Helvetica-Bold', marginRight: 10 * sf, color: '#666' }}>✓</Text>
                      <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica' }}>{item}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', lineHeight: 1.4 }}>{welcome.penOutro}</Text>
              </View>

              {/* Right Column */}
              <View style={{ width: '50%', flexDirection: 'column' }}>
                <View style={{ border: '1pt solid #E5E5E5', borderRadius: 4, marginBottom: 20 * sf }}>
                  {welcome.legend?.map((row: any, i: number) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 * sf, borderBottom: i < welcome.legend.length - 1 ? '1pt solid #E5E5E5' : 'none', backgroundColor: i % 2 === 0 ? '#F9F9F9' : '#FFFFFF' }}>
                      <Text style={{ width: 40 * sf, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 * sf }}>{row.num}</Text>
                      <View style={{ flex: 1, paddingHorizontal: 10 }}>
                        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 14 * sf, letterSpacing: 1 }}>{row.title}</Text>
                        <Text style={{ fontFamily: 'Helvetica', fontSize: 11 * sf, marginTop: 2 * sf }}>{row.desc}</Text>
                      </View>
                      <View style={{ width: 50 * sf, height: 40 * sf, border: '1pt solid #CCCCCC', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                        {row.symbol === '■' ? (
                          <View style={{ width: 20 * sf, height: 20 * sf, backgroundColor: '#000000' }}></View>
                        ) : (
                          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 20 * sf }}>{row.symbol}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
                
                {welcome.illustrationImage && (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 10 * sf }}>
                    <PdfImage src={welcome.illustrationImage} style={{ width: '100%', height: 250 * sf, objectFit: 'contain' }} />
                  </View>
                )}
              </View>
            </View>
          </Page>

                    <Page size={PAGE_SIZE as any} style={{ ...styles.centerPage, padding: 50 * sf, paddingHorizontal: pagePadding * sf }}>
            <Text style={{ fontSize: 48 * sf, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', marginBottom: 60 * sf }}>{mystery.title}</Text>
            
            <View style={{ width: '80%', alignSelf: 'center' }}>
              <View style={{ flexDirection: 'row', borderBottom: '1pt solid #E5E5E5', paddingBottom: 10 * sf, marginBottom: 10 * sf }}>
                <Text style={{ width: 80 * sf, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 * sf }}>Mark</Text>
                <Text style={{ width: 80 * sf, textAlign: 'center', fontFamily: 'Helvetica-Bold', fontSize: 16 * sf }}>Code</Text>
                <Text style={{ flex: 1, fontFamily: 'Helvetica-Bold', fontSize: 16 * sf }}>Name</Text>
                <Text style={{ width: 100 * sf, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 16 * sf }}>Density %</Text>
              </View>
              
              {mystery.marks?.map((row: any, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 * sf, borderBottom: i < mystery.marks.length - 1 ? '1pt solid #E5E5E5' : 'none' }}>
                  <View style={{ width: 80 * sf, alignItems: 'center' }}>
                    <View style={{ width: 50 * sf, height: 50 * sf, border: '1pt solid #000000', alignItems: 'center', justifyContent: 'center' }}>
                      {row.mark === '■' ? (
                        <View style={{ width: 25 * sf, height: 25 * sf, backgroundColor: '#000000' }}></View>
                      ) : (
                        <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 24 * sf }}>{row.mark}</Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={{ width: 80 * sf, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 18 * sf }}>{row.code}</Text>
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 18 * sf }}>{row.name}</Text>
                  </View>
                  
                  <View style={{ width: 100 * sf, alignItems: 'flex-end' }}>
                    <Text style={{ fontFamily: 'Helvetica', fontSize: 18 * sf }}>{row.density}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Page>

                    <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 24 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{warmup.title}</Text>
            <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 30 * sf, lineHeight: 1.5 }}>{warmup.subtitle}</Text>
            
            <View style={{ width: '100%', height: 1 * sf, backgroundColor: '#E5E5E5', marginBottom: 30 * sf }}></View>

            <View style={{ flex: 1, flexDirection: 'column', gap: 20 * sf }}>
              {warmup.levels?.map((lvl: any, i: number) => (
                <View key={i} style={{ flexDirection: 'column', marginBottom: 20 * sf }}>
                  <Text style={{ fontSize: 14 * sf, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 5 * sf }}>{lvl.label}</Text>
                  <Text style={{ fontSize: 12 * sf, fontFamily: 'Helvetica', marginBottom: 15 * sf }}>{lvl.desc}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 * sf }}>
                    {Array.from({ length: 10 }).map((_, col) => (
                      <View key={col} style={{ width: 40 * sf, height: 40 * sf, border: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                         <Text style={{ fontSize: 20 * sf, color: '#CCC', fontFamily: 'Helvetica' }}>{lvl.hint}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Page>

                    <Page size={PAGE_SIZE as any} style={{...styles.paddedPage, paddingHorizontal: pagePadding * sf}}>
            <Text style={{ fontSize: 28 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 15 * sf, textTransform: 'uppercase' }}>{pentesting.title}</Text>
            <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', textAlign: 'center', marginBottom: 32 * sf, lineHeight: 1.5 }}>{pentesting.subtitle}</Text>
            
            <View style={{ flexDirection: 'column', gap: 30 * sf, marginBottom: 50 * sf, paddingLeft: 20 * sf }}>
              {pentesting.pens?.map((pen: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10 * sf, maxWidth: 500 * sf }}>
                  <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica-Bold', width: 100 * sf }}>{pen}</Text>
                  <View style={{ flex: 1, borderBottom: '1pt solid black' }}></View>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 20 * sf, fontFamily: 'Helvetica-Bold', marginBottom: 20 * sf, textTransform: 'uppercase' }}>{pentesting.gridsTitle}</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={i} style={{ flexDirection: 'column', alignItems: 'center', width: '18%' }}>
                  <Text style={{ fontSize: 10 * sf, fontFamily: 'Helvetica-Bold', color: '#666', marginBottom: 10 * sf }}>GRID #{i + 1}</Text>
                  <View style={{ width: '100%', aspectRatio: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', borderTop: '1pt solid #999', borderLeft: '1pt solid #999' }}>
                    {Array.from({ length: 25 }).map((_, cellIdx) => {
                      const symbols = ['•', '1', '2', '3', '4', '5'];
                      const symbol = symbols[(i * 25 + cellIdx) % symbols.length];
                      return (
                        <View key={cellIdx} style={{ width: '20%', height: '20%', borderRight: '1pt solid #999', borderBottom: '1pt solid #999', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 8 * sf, color: '#CCC', fontFamily: 'Helvetica' }}>{symbol}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </Page>
        </>
      )}

      {processedImages.map((img, i) => {
        const { settings, gridCols, gridRows, cells } = img;
        const pageW = settings.trimSize === '8.5x11' ? 612 : settings.trimSize === '6x9' ? 432 : 612;
        const pageH = settings.trimSize === '8.5x11' ? 792 : settings.trimSize === '6x9' ? 648 : 612;
        const cSize = settings.cellSize;
        const margin = settings.pageMargin;
        const coordOffset = settings.showCoordinates ? cSize : 0;
        const contentW = gridCols * cSize + coordOffset;
        const contentH = gridRows * cSize + coordOffset;
        const baseMargin = 36;
        const gutter = settings.gutterMargin || 0;
        const marginX = baseMargin + gutter;
        const marginY = baseMargin;
        const maxW = pageW - marginX * 2 - 10; // safety buffer
        const maxH = pageH - marginY * 2 - 10; // safety buffer
        
        // Calculate the scale needed to fit the content within maxW/maxH
        const scale = Math.min(maxW / contentW, maxH / contentH);
        
        // Final dimensions to center properly
        const finalW = contentW * scale;
        const finalH = contentH * scale;

        return (
          <Page key={i} size={[pageW, pageH]} style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: finalW, height: finalH }}>
              <Svg width={finalW} height={finalH} viewBox={`0 0 ${contentW} ${contentH}`}>
                {settings.showCoordinates && (
                  <G>
                    {Array.from({ length: gridCols }).map((_, x) => (
                      <Text key={`cx-${x}`} x={coordOffset + x * cSize + cSize / 2} y={coordOffset / 2} style={{ fontSize: cSize * 0.4, fontFamily: 'Helvetica-Bold' }} textAnchor="middle">{getColumnLetter(x)}</Text>
                    ))}
                    {Array.from({ length: gridRows }).map((_, y) => (
                      <Text key={`cy-${y}`} x={coordOffset / 2} y={coordOffset + y * cSize + cSize / 2} style={{ fontSize: cSize * 0.4, fontFamily: 'Helvetica-Bold' }} textAnchor="middle">{y + 1}</Text>
                    ))}
                  </G>
                )}
                
                <G x={coordOffset} y={coordOffset}>
                  {cells.map((cell, idx) => {
                    const px = cell.x * cSize;
                    const py = cell.y * cSize;
                    const cx = px + cSize / 2;
                    const cy = py + cSize / 2;
                    const shapeIndex = cell.shapeIndex;
                    const code = cell.code;
                    const inkColor = settings.inkColor;
                    const inkThickness = settings.inkThickness;
                    
                    const elKey = `cell-${idx}`;
                    
                    if (isExportingSolutions) {
                      if (settings.renderStyle === 'pixels') {
                        const shades = ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill={shades[shapeIndex]} stroke="none" />
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                          </G>
                        );
                      } else {
                        let shapeEl = null;
                        if (shapeIndex === 1) shapeEl = <Circle cx={cx} cy={cy} r={Math.max(1, inkThickness * 1.5)} fill={inkColor} />;
                        if (shapeIndex === 2) shapeEl = <Line x1={px} y1={py + cSize} x2={px + cSize} y2={py} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 3) shapeEl = <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 4) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 5) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={cx} y1={py} x2={cx} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px} y1={cy} x2={px + cSize} y2={cy} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 6) shapeEl = <Rect x={px} y={py} width={cSize + 0.5} height={cSize + 0.5} fill={inkColor} />;
                        
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                            {shapeEl}
                          </G>
                        );
                      }
                    } else {
                      // Workbook Mode
                      return (
                        <G key={elKey}>
                          <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                          {shapeIndex > 0 && (
                            <Text x={cx} y={cy + cSize * 0.35} fill="black" style={{ fontSize: cSize * 0.55, fontFamily: 'Helvetica-Bold' }} textAnchor="middle">{settings.densityCodes ? settings.densityCodes[shapeIndex - 1] : code}</Text>
                          )}
                        </G>
                      );
                    }
                  })}
                </G>
              </Svg>
            </View>
          </Page>
        );
      })}

      {/* Solutions section */}
      {!isExportingSolutions && processedImages.map((img, i) => {
        const { settings, gridCols, gridRows, cells } = img;
        const pageW = settings.trimSize === '8.5x11' ? 612 : settings.trimSize === '6x9' ? 432 : 612;
        const pageH = settings.trimSize === '8.5x11' ? 792 : settings.trimSize === '6x9' ? 648 : 612;
        const cSize = settings.cellSize;
        const margin = settings.pageMargin;
        const coordOffset = settings.showCoordinates ? cSize : 0;
        const contentW = gridCols * cSize + coordOffset;
        const contentH = gridRows * cSize + coordOffset;
        const baseMargin = 36;
        const gutter = settings.gutterMargin || 0;
        const marginX = baseMargin + gutter;
        const marginY = baseMargin;
        const maxW = pageW - marginX * 2 - 10; // safety buffer
        const maxH = pageH - marginY * 2 - 10; // safety buffer
        
        // Calculate the scale needed to fit the content within maxW/maxH
        const scale = Math.min(maxW / contentW, maxH / contentH);
        
        // Final dimensions to center properly
        const finalW = contentW * scale;
        const finalH = contentH * scale;

        return (
          <Page key={i} size={[pageW, pageH]} style={{ backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: finalW, height: finalH }}>
              <Svg width={finalW} height={finalH} viewBox={`0 0 ${contentW} ${contentH}`}>
                {settings.showCoordinates && (
                  <G>
                    {Array.from({ length: gridCols }).map((_, x) => (
                      <Text key={`cx-${x}`} x={coordOffset + x * cSize + cSize / 2} y={coordOffset / 2} style={{ fontSize: cSize * 0.4, fontFamily: 'Helvetica-Bold' }} textAnchor="middle">{getColumnLetter(x)}</Text>
                    ))}
                    {Array.from({ length: gridRows }).map((_, y) => (
                      <Text key={`cy-${y}`} x={coordOffset / 2} y={coordOffset + y * cSize + cSize / 2} style={{ fontSize: cSize * 0.4, fontFamily: 'Helvetica-Bold' }} textAnchor="middle">{y + 1}</Text>
                    ))}
                  </G>
                )}
                
                <G x={coordOffset} y={coordOffset}>
                  {cells.map((cell, idx) => {
                    const px = cell.x * cSize;
                    const py = cell.y * cSize;
                    const cx = px + cSize / 2;
                    const cy = py + cSize / 2;
                    const shapeIndex = cell.shapeIndex;
                    const code = cell.code;
                    const inkColor = settings.inkColor;
                    const inkThickness = settings.inkThickness;
                    
                    const elKey = `cell-${idx}`;
                    
                    if (true) {
                      if (settings.renderStyle === 'pixels') {
                        const shades = ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000'];
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill={shades[shapeIndex]} stroke="none" />
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                          </G>
                        );
                      } else {
                        let shapeEl = null;
                        if (shapeIndex === 1) shapeEl = <Circle cx={cx} cy={cy} r={Math.max(1, inkThickness * 1.5)} fill={inkColor} />;
                        if (shapeIndex === 2) shapeEl = <Line x1={px} y1={py + cSize} x2={px + cSize} y2={py} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 3) shapeEl = <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />;
                        if (shapeIndex === 4) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 5) shapeEl = (
                          <G>
                            <Line x1={px} y1={py} x2={px + cSize} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px + cSize} y1={py} x2={px} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={cx} y1={py} x2={cx} y2={py + cSize} stroke={inkColor} strokeWidth={inkThickness} />
                            <Line x1={px} y1={cy} x2={px + cSize} y2={cy} stroke={inkColor} strokeWidth={inkThickness} />
                          </G>
                        );
                        if (shapeIndex === 6) shapeEl = <Rect x={px} y={py} width={cSize + 0.5} height={cSize + 0.5} fill={inkColor} />;
                        
                        return (
                          <G key={elKey}>
                            <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                            {shapeEl}
                          </G>
                        );
                      }
                    } else {
                      // Workbook Mode
                      return (
                        <G key={elKey}>
                          <Rect x={px} y={py} width={cSize} height={cSize} fill="none" stroke="#999999" strokeWidth={Math.max(1, cSize * 0.04)} />
                          {shapeIndex > 0 && (
                            <Text x={cx} y={cy + cSize * 0.35} fill="black" style={{ fontSize: cSize * 0.55, fontFamily: 'Helvetica-Bold' }} textAnchor="middle">{settings.densityCodes ? settings.densityCodes[shapeIndex - 1] : code}</Text>
                          )}
                        </G>
                      );
                    }
                  })}
                </G>
              </Svg>
            </View>
          </Page>
        );
      })}

      {!isExportingSolutions && (
                  <Page size={PAGE_SIZE as any} style={{ ...styles.paddedPage, paddingTop: 70 * sf , paddingHorizontal: pagePadding * sf }}>
            <Text style={{ fontSize: 30 * sf, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 60 * sf }}>{thankyou.title}</Text>
            
            <View style={{ width: '80%', alignSelf: 'center', flexDirection: 'column' }}>
              <View style={{ marginBottom: 30 * sf }}>
                <Text style={{ fontSize: 18 * sf, fontFamily: 'Helvetica-BoldOblique', marginBottom: 10 * sf }}>{thankyou.heading1}</Text>
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', lineHeight: 1.6 }}>{thankyou.body1}</Text>
              </View>

              <View style={{ marginBottom: 30 * sf }}>
                <Text style={{ fontSize: 18 * sf, fontFamily: 'Helvetica-BoldOblique', marginBottom: 10 * sf }}>{thankyou.heading2}</Text>
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', lineHeight: 1.6 }}>{thankyou.body2}</Text>
              </View>

              <View style={{ marginBottom: 30 * sf }}>
                <Text style={{ fontSize: 18 * sf, fontFamily: 'Helvetica-BoldOblique', marginBottom: 10 * sf }}>{thankyou.heading3}</Text>
                <Text style={{ fontSize: 16 * sf, fontFamily: 'Helvetica', lineHeight: 1.6 }}>{thankyou.body3}</Text>
              </View>
            </View>
          </Page>
      )}
    </Document>
  );
};

export const processImageForPdf = (img: HTMLImageElement, settings: ImageSettings): ProcessedImage => {
  const { gridCols, brightness, contrast, gamma, useDithering, overrides } = settings;
  const aspectRatio = img.height / img.width;
  const gridRows = Math.floor(gridCols * aspectRatio);

  const offscreen = document.createElement('canvas');
  offscreen.width = gridCols;
  offscreen.height = gridRows;
  const ctx = offscreen.getContext('2d');
  
  if (!ctx) return { gridCols, gridRows, cells: [], settings };

  ctx.imageSmoothingEnabled = settings.useSmoothing;
  ctx.drawImage(img, 0, 0, gridCols, gridRows);
  const imgData = ctx.getImageData(0, 0, gridCols, gridRows);
  const data = imgData.data;

  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const grays = new Float32Array(gridCols * gridRows);

  for (let i = 0; i < gridCols * gridRows; i++) {
      let r = data[i*4];
      let g = data[i*4+1];
      let b = data[i*4+2];
      
      let luminance = r * 0.299 + g * 0.587 + b * 0.114;
      if (gamma !== 1.0) {
        luminance = 255 * Math.pow(luminance / 255, 1 / gamma);
      }
      luminance = contrastFactor * (luminance - 128) + 128 + brightness;
      grays[i] = Math.max(0, Math.min(255, luminance));
  }

  const cells = [];
  const finalGrays = new Float32Array(gridCols * gridRows);
  
  const getShape = (g: number) => {
    if (g > 230) return SHAPES[0];
    if (g > 190) return SHAPES[1];
    if (g > 150) return SHAPES[2];
    if (g > 110) return SHAPES[3];
    if (g > 70)  return SHAPES[4];
    if (g > 30)  return SHAPES[5];
    return SHAPES[6];
  };

  const getLevel = (index: number) => {
    const levels = [255, 210, 170, 130, 90, 50, 0];
    return levels[index];
  };

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const idx = y * gridCols + x;
      let oldPixel = grays[idx];
      let shapeInfo = getShape(oldPixel);
      let newPixel = getLevel(shapeInfo.index);
      let quantError = oldPixel - newPixel;

      const overrideShapeIndex = overrides?.[x + ',' + y];
      if (overrideShapeIndex !== undefined) {
        shapeInfo = overrideShapeIndex === 0 ? SHAPES[0] : SHAPES.find(s => s.index === overrideShapeIndex) || SHAPES[0];
        newPixel = getLevel(shapeInfo.index);
        quantError = 0;
      }

      finalGrays[idx] = newPixel;
      if (useDithering) {
          if (x + 1 < gridCols) grays[idx + 1] += quantError * 7 / 16;
          if (y + 1 < gridRows) {
              if (x - 1 >= 0) grays[idx + gridCols - 1] += quantError * 3 / 16;
              grays[idx + gridCols] += quantError * 5 / 16;
              if (x + 1 < gridCols) grays[idx + gridCols + 1] += quantError * 1 / 16;
          }
      }
      cells.push({ x, y, shapeIndex: shapeInfo.index, code: shapeInfo.code });
    }
  }

  return { gridCols, gridRows, cells, settings };
};
